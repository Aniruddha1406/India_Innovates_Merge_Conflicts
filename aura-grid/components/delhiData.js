// ─── Delhi Node Graph Data ────────────────────────────────────────────────────
// Pure JS — no Leaflet, no browser APIs. Safe to import on server (SSR).

export const DELHI_NODES = [
    { id: 'DWK', name: 'Dwarka Sector 12', pos: [28.5931, 77.0598] },
    { id: 'DWM', name: 'Dwarka Mor Chowk', pos: [28.5936, 77.0737] },
    { id: 'PVI', name: 'Palam Vihar Intersection', pos: [28.5889, 77.1005] },
    { id: 'IGI', name: 'IGI Airport T3', pos: [28.5562, 77.0999] },
    { id: 'DHK', name: 'Dhaula Kuan Flyover', pos: [28.5921, 77.1598] },
    { id: 'SVJ', name: 'Shankar Vihar Junction', pos: [28.5783, 77.1890] },
    { id: 'SAK', name: 'Saket District Centre', pos: [28.5244, 77.2167] },
    { id: 'AIM', name: 'AIIMS New Delhi', pos: [28.5672, 77.2100] },
    { id: 'CNG', name: 'Connaught Place', pos: [28.6315, 77.2167] },
    { id: 'RJP', name: 'Rajpath / India Gate', pos: [28.6129, 77.2295] },
    { id: 'NZM', name: 'Nizamuddin Station', pos: [28.5893, 77.2507] },
    { id: 'LPN', name: 'Lajpat Nagar', pos: [28.5700, 77.2373] },
    { id: 'NWD', name: 'Nehru Place', pos: [28.5484, 77.2517] },
    { id: 'KRB', name: 'Karol Bagh', pos: [28.6512, 77.1906] },
    { id: 'RHN', name: 'Rohini Sector 18', pos: [28.7421, 77.1034] },
    { id: 'GTK', name: 'GTK Road / Azadpur', pos: [28.7104, 77.1842] },
    { id: 'CSH', name: 'Civil Lines / ISBT', pos: [28.6804, 77.2255] },
    { id: 'PGM', name: 'Pragati Maidan', pos: [28.6188, 77.2435] },
    { id: 'GTB', name: 'GTB Hospital (Northeast)', pos: [28.6799, 77.3073] },
    { id: 'NDC', name: 'Narela / Outer Ring', pos: [28.8450, 77.1034] },
];

// Weighted edges: [nodeId, nodeId, distanceMetres]
const EDGES = [
    ['DWK', 'DWM', 1100], ['DWM', 'PVI', 2400], ['PVI', 'IGI', 3700],
    ['IGI', 'SAK', 5500], ['PVI', 'DHK', 5700], ['DWM', 'DHK', 6800],
    ['DHK', 'SVJ', 3100], ['SVJ', 'AIM', 2500], ['SVJ', 'LPN', 3400],
    ['AIM', 'LPN', 1800], ['AIM', 'SAK', 4800], ['LPN', 'NZM', 2100],
    ['LPN', 'NWD', 3100], ['NZM', 'NWD', 2800], ['NZM', 'PGM', 2400],
    ['PGM', 'RJP', 1400], ['RJP', 'CNG', 2200], ['CNG', 'KRB', 2800],
    ['CNG', 'CSH', 3600], ['KRB', 'GTK', 3900], ['KRB', 'DHK', 5400],
    ['CSH', 'GTK', 2800], ['CSH', 'CNG', 3600], ['GTK', 'RHN', 5600],
    ['GTK', 'NDC', 9200], ['RHN', 'NDC', 8800], ['CSH', 'GTB', 7400],
    ['PGM', 'GTB', 6700], ['SAK', 'NWD', 3200], ['RJP', 'PGM', 1400],
    ['DHK', 'CNG', 7800], ['DHK', 'KRB', 6200],
];

function buildGraph() {
    const graph = {};
    DELHI_NODES.forEach(n => { graph[n.id] = []; });
    EDGES.forEach(([a, b, w]) => {
        graph[a].push({ id: b, weight: w });
        graph[b].push({ id: a, weight: w });
    });
    return graph;
}
export const GRAPH = buildGraph();

// ─── Dijkstra's Algorithm ─────────────────────────────────────────────────────
export function dijkstra(graph, sourceId, targetId) {
    const dist = {};
    const prev = {};
    const visited = new Set();
    DELHI_NODES.forEach(n => { dist[n.id] = Infinity; prev[n.id] = null; });
    dist[sourceId] = 0;
    const queue = [{ id: sourceId, d: 0 }];
    while (queue.length > 0) {
        queue.sort((a, b) => a.d - b.d);
        const { id: u } = queue.shift();
        if (visited.has(u)) continue;
        visited.add(u);
        if (u === targetId) break;
        for (const { id: v, weight } of (graph[u] || [])) {
            if (visited.has(v)) continue;
            const alt = dist[u] + weight;
            if (alt < dist[v]) {
                dist[v] = alt;
                prev[v] = u;
                queue.push({ id: v, d: alt });
            }
        }
    }
    const path = [];
    let cur = targetId;
    while (cur !== null) { path.unshift(cur); cur = prev[cur]; }
    if (path[0] !== sourceId) return { path: [sourceId, targetId], totalDist: Infinity };
    return { path, totalDist: dist[targetId] };
}
