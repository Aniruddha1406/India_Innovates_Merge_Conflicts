/**
 * CITY_NODES — Real named intersections / chowks for each supported city.
 * Each node: { id: string, name: string, pos: [lat, lng] }
 * Used by pickCorridorNodes() to select geographically relevant intersections
 * along a green corridor route.
 */

export const CITY_NODES = {

    Delhi: [
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
        { id: 'GTB', name: 'GTB Hospital Northeast', pos: [28.6799, 77.3073] },
        { id: 'NDC', name: 'Narela Outer Ring', pos: [28.8450, 77.1034] },
    ],

    Mumbai: [
        { id: 'DDR', name: 'Dadar TT Circle', pos: [19.0210, 72.8427] },
        { id: 'HMT', name: 'Hindmata Junction', pos: [19.0178, 72.8339] },
        { id: 'SIO', name: 'Sion Circle', pos: [19.0442, 72.8632] },
        { id: 'MHM', name: 'Mahim Causeway', pos: [19.0395, 72.8406] },
        { id: 'BKC', name: 'Bandra-Kurla Complex', pos: [19.0654, 72.8672] },
        { id: 'AND', name: 'Andheri Junction', pos: [19.1136, 72.8697] },
        { id: 'GRG', name: 'Goregaon Flyover', pos: [19.1663, 72.8526] },
        { id: 'BOV', name: 'Borivali Junction', pos: [19.2289, 72.8567] },
        { id: 'KRL', name: 'Kurla West Junction', pos: [19.0724, 72.8796] },
        { id: 'DHV', name: 'Dharavi Junction', pos: [19.0491, 72.8553] },
        { id: 'GKP', name: 'Ghatkopar Flyover', pos: [19.0869, 72.9086] },
        { id: 'MLN', name: 'Mulund Naka', pos: [19.1777, 72.9568] },
        { id: 'THN', name: 'Thane Station Junction', pos: [19.1864, 72.9785] },
        { id: 'VSH', name: 'Vashi Junction', pos: [19.0771, 72.9988] },
        { id: 'NRL', name: 'Nerul Circle', pos: [19.0322, 73.0169] },
        { id: 'GPS', name: 'Ghatkopar-Panvel Signal', pos: [19.0790, 73.0124] },
        { id: 'CBS', name: 'CST / CST Junction', pos: [18.9398, 72.8355] },
        { id: 'CFF', name: 'Churchgate Flyover', pos: [18.9322, 72.8264] },
    ],

    Bengaluru: [
        { id: 'SLK', name: 'Silk Board Junction', pos: [12.9176, 77.6234] },
        { id: 'HBL', name: 'Hebbal Flyover', pos: [13.0453, 77.5970] },
        { id: 'MRH', name: 'Marathahalli Bridge', pos: [12.9591, 77.6974] },
        { id: 'KRC', name: 'KR Circle', pos: [12.9784, 77.5943] },
        { id: 'MJS', name: 'Majestic Bus Stand', pos: [12.9771, 77.5713] },
        { id: 'SVJ', name: 'Shivajinagar Junction', pos: [12.9849, 77.6009] },
        { id: 'YSW', name: 'Yeshwantpur Junction', pos: [13.0246, 77.5477] },
        { id: 'NBH', name: 'Nagarbhavi Junction', pos: [12.9604, 77.5180] },
        { id: 'ECF', name: 'Electronic City Flyover', pos: [12.8458, 77.6620] },
        { id: 'SPR', name: 'Sarjapur Junction', pos: [12.9075, 77.6854] },
        { id: 'WHF', name: 'Whitefield Junction', pos: [12.9698, 77.7500] },
        { id: 'KRM', name: 'Koramangala 5th Block', pos: [12.9352, 77.6245] },
        { id: 'JLC', name: 'Jalahalli Cross', pos: [13.0529, 77.5518] },
        { id: 'RJN', name: 'Rajajinagar Cross', pos: [12.9884, 77.5523] },
        { id: 'DML', name: 'Domlur Flyover', pos: [12.9606, 77.6397] },
        { id: 'BNR', name: 'Bannerghatta Junction', pos: [12.9014, 77.5979] },
        { id: 'BLR', name: 'Bellandur Junction', pos: [12.9256, 77.6773] },
    ],

    Hyderabad: [
        { id: 'HTC', name: 'Hitech City Junction', pos: [17.4474, 78.3762] },
        { id: 'JBH', name: 'Jubilee Hills Check Post', pos: [17.4307, 78.4082] },
        { id: 'BGP', name: 'Begumpet Flyover', pos: [17.4428, 78.4635] },
        { id: 'LKP', name: 'Lakdikapul Junction', pos: [17.4091, 78.4645] },
        { id: 'MPT', name: 'Mehdipatnam Circle', pos: [17.3952, 78.4341] },
        { id: 'AMP', name: 'Ameerpet Junction', pos: [17.4374, 78.4488] },
        { id: 'SCT', name: 'Secunderabad Clock Tower', pos: [17.4399, 78.4983] },
        { id: 'LBN', name: 'LB Nagar Junction', pos: [17.3439, 78.5519] },
        { id: 'DLN', name: 'Dilsukhnagar Circle', pos: [17.3686, 78.5240] },
        { id: 'KKP', name: 'Kukatpally Junction', pos: [17.4948, 78.3996] },
        { id: 'GCB', name: 'Gachibowli Circle', pos: [17.4400, 78.3489] },
        { id: 'TLC', name: 'Tolichowki Flyover', pos: [17.4052, 78.4231] },
        { id: 'MDP', name: 'Madhapur Junction', pos: [17.4487, 78.3909] },
        { id: 'KPB', name: 'KPHB Phase 1 Junction', pos: [17.4946, 78.3724] },
        { id: 'UPL', name: 'Uppal Junction', pos: [17.3987, 78.5593] },
        { id: 'BGD', name: 'Banjara Hills Road No. 12', pos: [17.4253, 78.4354] },
        { id: 'CHR', name: 'Charminar Circle', pos: [17.3616, 78.4747] },
    ],

    Chennai: [
        { id: 'ANS', name: 'Anna Salai Junction', pos: [13.0569, 80.2523] },
        { id: 'TNR', name: 'T. Nagar Pondy Bazaar', pos: [13.0418, 80.2341] },
        { id: 'VDP', name: 'Vadapalani Circle', pos: [13.0517, 80.2121] },
        { id: 'KYB', name: 'Koyambedu Hub', pos: [13.0698, 80.1964] },
        { id: 'PRR', name: 'Porur Junction', pos: [13.0363, 80.1591] },
        { id: 'TMB', name: 'Tambaram Circle', pos: [12.9229, 80.1272] },
        { id: 'GND', name: 'Guindy Junction', pos: [13.0068, 80.2206] },
        { id: 'TDP', name: 'Tidel Park Signal', pos: [12.9904, 80.2478] },
        { id: 'ADY', name: 'Adyar Signal', pos: [13.0067, 80.2574] },
        { id: 'BSN', name: 'Besant Nagar Circle', pos: [12.9990, 80.2674] },
        { id: 'VLC', name: 'Velachery Junction', pos: [12.9798, 80.2209] },
        { id: 'MDV', name: 'Medavakkam Junction', pos: [12.9279, 80.1986] },
        { id: 'OMR', name: 'OMR Toll Plaza', pos: [12.9526, 80.2286] },
        { id: 'PRB', name: 'Perambur Circle', pos: [13.1094, 80.2424] },
        { id: 'PLV', name: 'Pallavaram Circle', pos: [12.9675, 80.1508] },
        { id: 'EGM', name: 'Egmore Junction', pos: [13.0784, 80.2621] },
        { id: 'MBM', name: 'Mylapore Circle', pos: [13.0339, 80.2680] },
    ],

    Pune: [
        { id: 'SHN', name: 'Shivajinagar Circle', pos: [18.5308, 73.8474] },
        { id: 'KTH', name: 'Kothrud Depot Junction', pos: [18.5085, 73.8071] },
        { id: 'HDP', name: 'Hadapsar Junction', pos: [18.5018, 73.9290] },
        { id: 'VNR', name: 'Viman Nagar Circle', pos: [18.5679, 73.9143] },
        { id: 'KTJ', name: 'Katraj Circle', pos: [18.4556, 73.8636] },
        { id: 'SWT', name: 'Swargate Bus Stand', pos: [18.5016, 73.8618] },
        { id: 'FCR', name: 'FC Road Junction', pos: [18.5238, 73.8403] },
        { id: 'DCN', name: 'Deccan Gymkhana', pos: [18.5178, 73.8404] },
        { id: 'PMP', name: 'Pimpri Circle', pos: [18.6279, 73.8006] },
        { id: 'CCW', name: 'Chinchwad Junction', pos: [18.6453, 73.7803] },
        { id: 'WKD', name: 'Wakad Circle', pos: [18.5979, 73.7616] },
        { id: 'BNR', name: 'Baner Junction', pos: [18.5605, 73.7879] },
        { id: 'AUN', name: 'Aundh Circle', pos: [18.5587, 73.8094] },
        { id: 'HJW', name: 'Hinjewadi Phase 1', pos: [18.5981, 73.7263] },
        { id: 'KHR', name: 'Kharadi Junction', pos: [18.5508, 73.9466] },
        { id: 'KNH', name: 'Kondhwa Junction', pos: [18.4700, 73.8935] },
        { id: 'MKT', name: 'Market Yard Junction', pos: [18.4960, 73.8622] },
    ],

    Kolkata: [
        { id: 'ESP', name: 'Esplanade Crossing', pos: [22.5726, 88.3639] },
        { id: 'PRK', name: 'Park Street Junction', pos: [22.5514, 88.3519] },
        { id: 'GRH', name: 'Gariahat More', pos: [22.5191, 88.3668] },
        { id: 'RSB', name: 'Rashbehari More', pos: [22.5262, 88.3534] },
        { id: 'UTD', name: 'Ultadanga Junction', pos: [22.5757, 88.3880] },
        { id: 'DDM', name: 'Dum Dum Junction', pos: [22.6519, 88.3991] },
        { id: 'GRS', name: 'Garia Station Junction', pos: [22.4621, 88.3871] },
        { id: 'TLJ', name: 'Tala Junction', pos: [22.6092, 88.3766] },
        { id: 'BLG', name: 'Ballygunge Circle', pos: [22.5338, 88.3669] },
        { id: 'LKT', name: 'Lake Town Junction', pos: [22.6037, 88.4066] },
        { id: 'NWS', name: 'New Town Sector V', pos: [22.5767, 88.4633] },
        { id: 'BST', name: 'Barasat Junction', pos: [22.7235, 88.4776] },
        { id: 'BHL', name: 'Behala Crossing', pos: [22.4949, 88.3107] },
        { id: 'BGT', name: 'Baguiati Junction', pos: [22.6067, 88.4321] },
        { id: 'HWH', name: 'Howrah Station Junction', pos: [22.5833, 88.3417] },
        { id: 'SDR', name: 'Sealdah Junction', pos: [22.5657, 88.3760] },
        { id: 'DUM', name: 'Dumdum Cantonment', pos: [22.6364, 88.4031] },
    ],

    Ahmedabad: [
        { id: 'NVR', name: 'Navrangpura Circle', pos: [23.0395, 72.5567] },
        { id: 'ISC', name: 'ISCON Circle', pos: [23.0294, 72.5062] },
        { id: 'PLD', name: 'Paldi Junction', pos: [23.0143, 72.5665] },
        { id: 'MNG', name: 'Maninagar Circle', pos: [22.9970, 72.6103] },
        { id: 'NRD', name: 'Naroda Junction', pos: [23.0806, 72.6464] },
        { id: 'VTV', name: 'Vatva Junction', pos: [22.9698, 72.6365] },
        { id: 'BPL', name: 'Bopal Circle', pos: [23.0277, 72.4730] },
        { id: 'SGH', name: 'SG Highway Junction', pos: [23.0344, 72.5101] },
        { id: 'STL', name: 'Satellite Circle', pos: [23.0277, 72.5131] },
        { id: 'VSP', name: 'Vastrapur Lake Junction', pos: [23.0369, 72.5270] },
        { id: 'GTC', name: 'Gota Circle', pos: [23.0785, 72.5424] },
        { id: 'CKD', name: 'Chandkheda Junction', pos: [23.1003, 72.5870] },
        { id: 'NKL', name: 'Nikol Circle', pos: [23.0439, 72.6483] },
        { id: 'VSL', name: 'Vastral Junction', pos: [23.0218, 72.6604] },
        { id: 'SRJ', name: 'Shivranjani Cross Roads', pos: [23.0217, 72.5329] },
        { id: 'AHM', name: 'Ahmedabad Junction (Old)', pos: [23.0230, 72.5984] },
        { id: 'CTV', name: 'Chandola Lake Junction', pos: [22.9993, 72.6265] },
    ],
};

/**
 * Returns the array of nodes for a given city name.
 * Falls back to Delhi if city not found.
 */
export function getNodesForCity(cityName) {
    return CITY_NODES[cityName] || CITY_NODES['Delhi'];
}

/**
 * Pick N nodes from the city's list that are geographically distributed
 * along the straight-line path from origin to destination.
 */
export function pickCorridorNodes(originLatLng, destLatLng, cityName, count = 5) {
    if (!originLatLng || !destLatLng) return [];
    const allNodes = getNodesForCity(cityName);

    // Build evenly-spaced waypoints along the straight-line route
    const waypoints = [];
    for (let i = 1; i <= count; i++) {
        const t = i / (count + 1);
        waypoints.push({
            lat: originLatLng.lat + (destLatLng.lat - originLatLng.lat) * t,
            lng: originLatLng.lng + (destLatLng.lng - originLatLng.lng) * t,
        });
    }

    // For each waypoint, pick the closest city node not already used
    const used = new Set();
    const picked = [];
    for (const wp of waypoints) {
        let best = null, bestDist = Infinity;
        for (const node of allNodes) {
            if (used.has(node.id)) continue;
            const d = Math.hypot(node.pos[0] - wp.lat, node.pos[1] - wp.lng);
            if (d < bestDist) { bestDist = d; best = node; }
        }
        if (best) { used.add(best.id); picked.push(best); }
    }

    return picked.slice(0, count);
}
