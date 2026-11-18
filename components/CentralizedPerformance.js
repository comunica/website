import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

// Results exported by scripts/report.js --export in https://github.com/comunica/Experiments-Centralized
const DEFAULT_SOURCE = '/performance-centralized/results.json';
const BENCHMARKS = [ 'WatDiv', 'BSBM', 'LDBC SNB' ];
// Comunica is the accent, one engine to compare with is the second color, and the others recede.
const COLOR_COMUNICA = '#9C0510';
const COLOR_SELECTED = '#2a78d6';
const COLOR_OTHER = '#8f8e88';
const SURFACE = '#ffffff';

const collator = new Intl.Collator('en', { numeric: true });
const formats = {};
function format(value, digits) {
    formats[digits] ??= new Intl.NumberFormat('en', { minimumFractionDigits: digits, maximumFractionDigits: digits });
    return formats[digits].format(value);
}

function formatTime(ms) {
    if (ms < 1000) {
        return `${format(ms, ms < 1 ? 2 : ms < 10 ? 1 : 0)} ms`;
    }
    return `${format(ms / 1000, ms < 10000 ? 2 : ms < 100000 ? 1 : 0)} s`;
}

// Axis ticks are powers of ten, such as 0.1 ms, 10 ms, 1 s and 1,000 s.
function formatTick(ms) {
    return ms < 1000 ? `${Number(ms.toPrecision(1))} ms` : `${format(ms / 1000, 0)} s`;
}

function formatDuration(seconds) {
    if (seconds < 0.1) {
        return '< 0.1 s';
    }
    if (seconds < 100) {
        return `${format(seconds, seconds < 10 ? 1 : 0)} s`;
    }
    if (seconds < 6000) {
        return `${format(seconds / 60, 1)} min`;
    }
    return `${format(seconds / 3600, 1)} h`;
}

function formatBytes(bytes) {
    if (bytes >= 2 ** 30) {
        return `${format(bytes / 2 ** 30, 1)} GiB`;
    }
    return `${format(bytes / 2 ** 20, bytes >= 10 * 2 ** 20 ? 0 : 1)} MiB`;
}

function formatTriples(triples) {
    if (triples >= 1e6) {
        return `${format(triples / 1e6, triples < 1e7 ? 1 : 0)}M triples`;
    }
    return `${format(triples / 1e3, 0)}K triples`;
}

function shortName(template) {
    return template
        .replace(/^interactive-complex-(\d+)$/u, 'IC$1')
        .replace(/^interactive-short-(\d+)$/u, 'IS$1');
}

function scaleName(run) {
    return run.triples ? formatTriples(run.triples) : run.scaleLabel;
}

// A template answered without failures and with the result count that most engines agree on.
function answered(template) {
    return Boolean(template) && template.mean !== null && template.failed === 0 && !(template.invalid > 0);
}

function analyze(run, reference) {
    const engines = run.engines.filter(engine => engine.templates);
    const templates = [ ...new Set(engines.flatMap(engine => Object.keys(engine.templates))) ].sort(collator.compare);
    const ref = engines.find(engine => engine.name === reference);
    // Means and totals are only comparable over the same templates, so they cover those that every engine answered.
    const common = templates.filter(t => engines.every(engine => answered(engine.templates[t])));
    const rows = engines.map(engine => {
        const times = common.map(t => Math.max(engine.templates[t].mean, 0.01));
        const shared = ref ? templates.filter(t => answered(engine.templates[t]) && answered(ref.templates[t])) : [];
        const logRatios = shared.map(t => Math.log(Math.max(engine.templates[t].mean, 0.01) / Math.max(ref.templates[t].mean, 0.01)));
        return {
            engine,
            answered: templates.filter(t => answered(engine.templates[t])).length,
            shared: shared.length,
            relative: shared.length > 0 ? Math.exp(logRatios.reduce((a, b) => a + b, 0) / shared.length) : null,
            mean: times.length > 0 ? Math.exp(times.reduce((sum, time) => sum + Math.log(time), 0) / times.length) : null,
            total: times.length > 0 ? times.reduce((sum, time) => sum + time, 0) : null,
        };
    });
    return { engines, templates, common, rows };
}

function useWidth(ref) {
    const [ width, setWidth ] = useState(0);
    useLayoutEffect(() => {
        const element = ref.current;
        if (!element) {
            return undefined;
        }
        const observer = new ResizeObserver(entries => setWidth(Math.floor(entries[0].contentRect.width)));
        observer.observe(element);
        setWidth(Math.floor(element.getBoundingClientRect().width));
        return () => observer.disconnect();
    }, [ ref ]);
    return width;
}

function Marker({ shape, color, hollow, size = 5, x = 0, y = 0 }) {
    const fill = hollow ? SURFACE : color;
    const stroke = hollow ? color : SURFACE;
    if (shape === 'diamond') {
        const r = size + 1;
        return <polygon points={`${x},${y - r} ${x + r},${y} ${x},${y + r} ${x - r},${y}`} fill={fill} stroke={stroke} strokeWidth={2}/>;
    }
    return <circle cx={x} cy={y} r={size} fill={fill} stroke={stroke} strokeWidth={2}/>;
}

function Swatch({ shape, color, hollow }) {
    return (
        <svg className="perf-swatch" width={16} height={16} viewBox="-8 -8 16 16" aria-hidden="true">
            <Marker shape={shape} color={color} hollow={hollow}/>
        </svg>
    );
}

function Cross({ x, y, color }) {
    return (
        <path d={`M${x - 4},${y - 4}L${x + 4},${y + 4}M${x - 4},${y + 4}L${x + 4},${y - 4}`} stroke={color} strokeWidth={2} strokeLinecap="round"/>
    );
}

export default function CentralizedPerformance({ src = DEFAULT_SOURCE }) {
    const [ data, setData ] = useState(null);
    const [ error, setError ] = useState(null);
    const [ benchmark, setBenchmark ] = useState(null);
    const [ scales, setScales ] = useState({});
    const [ highlighted, setHighlighted ] = useState({});
    const [ showTable, setShowTable ] = useState(false);

    useEffect(() => {
        let cancelled = false;
        fetch(src)
            .then(response => response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`)))
            .then(json => !cancelled && setData(json))
            .catch(err => !cancelled && setError(err));
        return () => {
            cancelled = true;
        };
    }, [ src ]);

    if (error) {
        return <p className="perf-status">The results could not be loaded ({error.message}).</p>;
    }
    if (!data) {
        return <p className="perf-status">Loading the results…</p>;
    }

    const reference = data.reference;
    const benchmarks = BENCHMARKS.filter(name => data.runs.some(run => run.experiment === name));
    const current = benchmark ?? benchmarks[0];
    const runs = data.runs.filter(run => run.experiment === current)
        .sort((a, b) => collator.compare(a.scale ?? '', b.scale ?? ''));
    const run = runs.find(r => r.scale === scales[current]) ?? runs[runs.length - 1];
    return (
        <Results
            data={data}
            reference={reference}
            benchmarks={benchmarks}
            benchmark={current}
            setBenchmark={setBenchmark}
            runs={runs}
            run={run}
            setScale={scale => setScales({ ...scales, [current]: scale })}
            highlighted={highlighted}
            setHighlighted={setHighlighted}
            showTable={showTable}
            setShowTable={setShowTable}
        />
    );
}

function Results({ reference, benchmarks, benchmark, setBenchmark, runs, run, setScale, highlighted, setHighlighted, showTable, setShowTable }) {
    const analysis = useMemo(() => analyze(run, reference), [ run, reference ]);
    const runKey = `${run.experiment}|${run.scale}`;
    // An engine that was clicked in the table, which the chart highlights.
    const selected = highlighted[runKey] ?? null;
    const select = name => setHighlighted({ ...highlighted, [runKey]: name });
    const refEngine = analysis.engines.find(engine => engine.name === reference);
    const style = engine => ({
        shape: engine.name === 'comunica-hdt' ? 'diamond' : 'circle',
        color: engine.name === selected ? COLOR_SELECTED : engine.name.startsWith('comunica') ? COLOR_COMUNICA : COLOR_OTHER,
        emphasized: engine.name === selected || engine.name.startsWith('comunica'),
    });

    return (
        <div className="perf">
            <div className="perf-controls">
                <div className="perf-segmented" role="group" aria-label="Benchmark">
                    {benchmarks.map(name => (
                        <button key={name} type="button" aria-pressed={name === benchmark} onClick={() => setBenchmark(name)}>{name}</button>
                    ))}
                </div>
                {runs.length > 1 && (
                    <div className="perf-segmented" role="group" aria-label="Dataset size">
                        {runs.map(r => (
                            <button key={r.scale} type="button" aria-pressed={r === run} title={r.scaleLabel} onClick={() => setScale(r.scale)}>{scaleName(r)}</button>
                        ))}
                    </div>
                )}
            </div>

            <p className="perf-caption">{describeRun(run, analysis)}</p>

            <EngineTable analysis={analysis} refEngine={refEngine} selected={selected} select={select} style={style}/>

            <Legend analysis={analysis} refEngine={refEngine} selected={selected} style={style}/>
            <DotPlot analysis={analysis} style={style}/>

            <button type="button" className="perf-toggle" aria-expanded={showTable} onClick={() => setShowTable(!showTable)}>
                {showTable ? 'Hide the values per template' : 'Show the values per template as a table'}
            </button>
            {showTable && <ValueTable analysis={analysis}/>}
        </div>
    );
}

function describeRun(run, analysis) {
    const p = run.params ?? {};
    const parts = [ `${run.experiment}, ${run.scaleLabel}${run.triples ? ` (${formatTriples(run.triples)})` : ''}: ${analysis.templates.length} query templates.` ];
    if (p.queryCount && p.queryRunnerReplication) {
        parts.push(`Each template has ${p.queryCount} queries, each executed ${p.queryRunnerReplication} times after ${p.queryRunnerWarmupRounds ?? 0} warm-up round${p.queryRunnerWarmupRounds === 1 ? '' : 's'}; times are their mean.`);
    } else if (run.experiment === 'BSBM') {
        parts.push('Times are the geometric mean per query type over the query mixes of the BSBM test driver.');
    }
    return parts.join(' ');
}

// The best of a column's values, or undefined when all engines share it, as marking every row says nothing.
function best(values, isBetter) {
    const known = values.filter(value => value !== null && value !== undefined);
    if (known.length < 2) {
        return undefined;
    }
    const top = known.reduce((a, b) => isBetter(b, a) ? b : a);
    return known.every(value => value === top) ? undefined : top;
}

function Best({ value, children }) {
    return value ? <strong className="perf-best">{children}</strong> : children;
}

function EngineTable({ analysis, refEngine, selected, select, style }) {
    const total = analysis.templates.length;
    const lower = (a, b) => a < b;
    const { rows } = analysis;
    const bestAnswered = best(rows.map(row => row.answered), (a, b) => a > b);
    const bestMean = best(rows.map(row => row.mean), lower);
    const bestTotal = best(rows.map(row => row.total), lower);
    const bestLoading = best(rows.map(row => row.engine.ingestion), lower);
    // Memory and disk sizes are not comparable, so each has its own best.
    const bestStore = kind => best(rows.filter(row => row.engine.storeSize?.kind === kind).map(row => row.engine.storeSize.bytes), lower);
    const bestStores = { memory: bestStore('memory'), disk: bestStore('disk') };
    return (
        <div className="table-wrapper">
            <table className="perf-engines">
                <thead>
                    <tr>
                        <th scope="col">Engine</th>
                        <th scope="col">Answered</th>
                        <th scope="col">Mean</th>
                        <th scope="col">Total</th>
                        {refEngine && <th scope="col">vs {refEngine.label}</th>}
                        <th scope="col">Loading</th>
                        <th scope="col">Store size</th>
                    </tr>
                </thead>
                <tbody>
                    {analysis.rows.map(row => {
                        const { engine } = row;
                        const s = style(engine);
                        const isReference = refEngine && engine.name === refEngine.name;
                        return (
                            <tr key={engine.name} className={engine.name === selected ? 'perf-selected' : isReference ? 'perf-reference' : undefined}>
                                <th scope="row">
                                    {isReference ? (
                                        <span className="perf-engine"><Swatch shape={s.shape} color={s.color}/>{engine.label}</span>
                                    ) : (
                                        <button type="button" className="perf-engine" aria-pressed={engine.name === selected}
                                            title={`Highlight ${engine.label} in the chart`} onClick={() => select(engine.name === selected ? null : engine.name)}>
                                            <Swatch shape={s.shape} color={s.color}/>{engine.label}
                                        </button>
                                    )}
                                </th>
                                <td><Best value={row.answered === bestAnswered}>{row.answered} of {total}</Best></td>
                                <td>{row.mean === null ? '–' : <Best value={row.mean === bestMean}>{formatTime(row.mean)}</Best>}</td>
                                <td>{row.total === null ? '–' : <Best value={row.total === bestTotal}>{formatTime(row.total)}</Best>}</td>
                                {refEngine && <td>{isReference ? 'reference' : <Relative row={row}/>}</td>}
                                <td title={engine.name === 'comunica-hdt' ? 'Creating the HDT file and its index, and opening them' : undefined}>
                                    {engine.ingestion === null || engine.ingestion === undefined ? '–' : <Best value={engine.ingestion === bestLoading}>{formatDuration(engine.ingestion)}</Best>}
                                </td>
                                <td>
                                    {engine.storeSize ? (
                                        <><Best value={engine.storeSize.bytes === bestStores[engine.storeSize.kind]}>{formatBytes(engine.storeSize.bytes)}</Best> <span className="perf-muted">{engine.storeSize.kind}</span></>
                                    ) : '–'}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <p className="perf-muted perf-footnote">
                Answered: templates without timeouts or errors, and with the result count most engines agree on.
                Mean (geometric) and total of the time per template, over the {analysis.common.length} template{analysis.common.length === 1 ? '' : 's'} that every engine answered.
                {refEngine && ` vs ${refEngine.label}: geometric mean of the time ratio, over the templates that both answered.`}
                {' '}Bold: the best value of a column, and for store sizes, the smallest in memory and on disk.
            </p>
        </div>
    );
}

function Relative({ row }) {
    if (row.relative === null) {
        return <span className="perf-muted">no shared templates</span>;
    }
    const ratio = row.relative >= 1 ? row.relative : 1 / row.relative;
    const words = ratio < 1.05 ? 'about equal' : `${format(ratio, ratio < 10 ? 1 : 0)}× ${row.relative >= 1 ? 'slower' : 'faster'}`;
    return (
        <span title={`Geometric mean of the time ratio over the ${row.shared} templates that both engines answered`}>
            {words} <span className="perf-muted">on {row.shared}</span>
        </span>
    );
}

function Legend({ analysis, refEngine, selected, style }) {
    const items = [];
    for (const engine of analysis.engines) {
        const s = style(engine);
        if (s.emphasized) {
            items.push(<li key={engine.name}><Swatch shape={s.shape} color={s.color}/>{engine.label}</li>);
        }
    }
    if (analysis.engines.some(engine => !style(engine).emphasized)) {
        items.push(<li key="other"><Swatch shape="circle" color={COLOR_OTHER}/>Other engines</li>);
    }
    items.push(<li key="invalid"><Swatch shape="circle" color={COLOR_OTHER} hollow/>Different result count</li>);
    items.push(
        <li key="failed">
            <svg className="perf-swatch" width={16} height={16} viewBox="-8 -8 16 16" aria-hidden="true"><Cross x={0} y={0} color={COLOR_OTHER}/></svg>
            Timeout or error
        </li>,
    );
    return <ul className="perf-legend" aria-label="Legend">{items}</ul>;
}

const ROW_HEIGHT = 26;
const AXIS_HEIGHT = 28;
const LABEL_WIDTH = 46;
const FAIL_WIDTH = 64;

function DotPlot({ analysis, style }) {
    const container = useRef(null);
    const width = useWidth(container);
    const [ hover, setHover ] = useState(null);
    const { engines, templates } = analysis;

    const values = engines.flatMap(engine => templates
        .map(t => engine.templates[t])
        .filter(t => t && t.mean !== null && t.failed === 0)
        .map(t => Math.max(t.mean, 0.01)));
    const lo = values.length > 0 ? 10 ** Math.floor(Math.log10(Math.min(...values))) : 1;
    const hi = Math.max(values.length > 0 ? 10 ** Math.ceil(Math.log10(Math.max(...values))) : 1, lo * 100);
    const plotLeft = LABEL_WIDTH + 10;
    const plotRight = Math.max(plotLeft + 100, width - FAIL_WIDTH - 12);
    const x = value => plotLeft + (Math.log10(Math.max(value, 0.01)) - Math.log10(lo)) / (Math.log10(hi) - Math.log10(lo)) * (plotRight - plotLeft);
    const height = AXIS_HEIGHT + templates.length * ROW_HEIGHT + 8;
    const ticks = [];
    for (let tick = lo; tick <= hi * 1.001; tick *= 10) {
        ticks.push(tick);
    }
    // On narrow screens, only every other decade is labeled, so that labels do not collide.
    const labelEvery = (plotRight - plotLeft) / Math.max(1, ticks.length - 1) < 56 ? 2 : 1;
    // Emphasized engines are drawn last, so they stay on top.
    const order = [ ...engines ].sort((a, b) => Number(style(a).emphasized) - Number(style(b).emphasized));

    return (
        <div className="perf-plot" ref={container} onMouseLeave={() => setHover(null)}>
            {width > 0 && (
                <svg width={width} height={height} role="img" aria-label="Mean query time per template and engine, on a logarithmic scale">
                    <rect x={plotRight + 12} y={AXIS_HEIGHT - 6} width={Math.max(0, width - plotRight - 12)} height={height - AXIS_HEIGHT - 2} className="perf-lane"/>
                    {ticks.map((tick, i) => (
                        <g key={tick}>
                            <line x1={x(tick)} x2={x(tick)} y1={AXIS_HEIGHT - 6} y2={height - 8} className="perf-grid"/>
                            {(ticks.length - 1 - i) % labelEvery === 0 && (
                                <text x={x(tick)} y={AXIS_HEIGHT - 12} textAnchor="middle" className="perf-axis">{formatTick(tick)}</text>
                            )}
                        </g>
                    ))}
                    <text x={plotRight + 12 + FAIL_WIDTH / 2} y={AXIS_HEIGHT - 12} textAnchor="middle" className="perf-axis">Failed</text>
                    {templates.map((t, i) => {
                        const y = AXIS_HEIGHT + i * ROW_HEIGHT + ROW_HEIGHT / 2;
                        const points = order.map(engine => ({ engine, template: engine.templates[t], style: style(engine) }));
                        const plotted = points.filter(p => p.template && p.template.mean !== null && p.template.failed === 0);
                        const failed = points.filter(p => !p.template || p.template.mean === null || p.template.failed > 0);
                        const failedEmphasized = failed.filter(p => p.style.emphasized);
                        const failedOther = failed.length - failedEmphasized.length;
                        const xs = plotted.map(p => x(p.template.mean));
                        const show = event => {
                            const bounds = container.current.getBoundingClientRect();
                            setHover({ template: t, y: y + ROW_HEIGHT / 2, x: event && event.clientX ? event.clientX - bounds.left : plotLeft });
                        };
                        return (
                            <g key={t} tabIndex={0} className="perf-row" onMouseMove={show} onFocus={() => show()} onBlur={() => setHover(null)}
                                aria-label={rowSummary(t, points)}>
                                <rect x={0} y={y - ROW_HEIGHT / 2} width={width} height={ROW_HEIGHT} className={hover?.template === t ? 'perf-row-bg perf-row-active' : 'perf-row-bg'}/>
                                <text x={LABEL_WIDTH} y={y + 4} textAnchor="end" className="perf-label">{shortName(t)}</text>
                                {xs.length > 1 && <line x1={Math.min(...xs)} x2={Math.max(...xs)} y1={y} y2={y} className="perf-range"/>}
                                {plotted.map(p => (
                                    <Marker key={p.engine.name} x={x(p.template.mean)} y={y} shape={p.style.shape} color={p.style.color}
                                        hollow={p.template.invalid > 0} size={p.style.emphasized ? 5 : 4}/>
                                ))}
                                {failedEmphasized.map((p, j) => <Cross key={p.engine.name} x={plotRight + 26 + j * 12} y={y} color={p.style.color}/>)}
                                {failedOther > 0 && (
                                    <text x={plotRight + 26 + failedEmphasized.length * 12 - 4} y={y + 4} className="perf-label">+{failedOther}</text>
                                )}
                            </g>
                        );
                    })}
                </svg>
            )}
            {hover && <Tooltip analysis={analysis} template={hover.template} style={style} top={hover.y} left={hover.x} width={width}/>}
        </div>
    );
}

function status(template) {
    if (!template) {
        return 'not run';
    }
    if (template.mean === null || template.failed > 0) {
        return template.failed < template.queries ? `${template.failed} of ${template.queries} queries failed` : 'failed';
    }
    return null;
}

function rowSummary(template, points) {
    const parts = points.map(p => `${p.engine.label} ${status(p.template) ?? formatTime(p.template.mean)}`);
    return `${shortName(template)}: ${parts.join(', ')}`;
}

function Tooltip({ analysis, template, style, top, left, width }) {
    const entries = analysis.engines.map(engine => ({ engine, t: engine.templates[template], s: style(engine) }));
    const rank = e => (status(e.t) ? Infinity : e.t.mean);
    entries.sort((a, b) => rank(a) - rank(b));
    const tooltipWidth = 250;
    const x = Math.min(Math.max(left + 14, 0), Math.max(0, width - tooltipWidth));
    return (
        <div className="perf-tooltip" style={{ top, left: x, width: tooltipWidth }} aria-hidden="true">
            <div className="perf-tooltip-title">{shortName(template)}</div>
            <ul>
                {entries.map(({ engine, t, s }) => (
                    <li key={engine.name}>
                        <span className="perf-key" style={{ background: s.color }}/>
                        <strong>{status(t) ?? formatTime(t.mean)}</strong>
                        <span className="perf-muted">{engine.label}{!status(t) && t.invalid > 0 ? ', different result count' : ''}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ValueTable({ analysis }) {
    const { engines, templates } = analysis;
    return (
        <div className="table-wrapper">
            <table className="perf-values">
                <thead>
                    <tr>
                        <th scope="col">Template</th>
                        {engines.map(engine => <th key={engine.name} scope="col">{engine.label}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {templates.map(t => (
                        <tr key={t}>
                            <th scope="row">{shortName(t)}</th>
                            {engines.map(engine => {
                                const template = engine.templates[t];
                                const failure = status(template);
                                return (
                                    <td key={engine.name} className={failure ? 'perf-muted' : undefined}>
                                        {failure ?? `${formatTime(template.mean)}${template.invalid > 0 ? ' ≠' : ''}`}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className="perf-muted perf-footnote">≠: the result count differs from the count most engines returned.</p>
        </div>
    );
}
