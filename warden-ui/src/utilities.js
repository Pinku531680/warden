// function to generate numbers that are not just random but
  // really create Log Normal Distribution, Box-Muller transform
export const gaussianRandom = (mean, stdDev) => {

    const u = 1 - Math.random();
    const v = Math.random();
    const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);

    const output = z * stdDev + mean;

    return Math.max(0, round(output, 0));
}

export const random = (upperBound) => {

    return Math.random() * upperBound;
}

export const randomInRange = (min, max) => {

    return (Math.random() * (max - min)) + min;
}

export const round = (num, decimalPlaces) => {
    // takes no. of decimal places to round to  
    // supports for +Ve and -ve numebrs
    const factor = Math.pow(10, decimalPlaces);

    return Math.trunc(num * factor) / factor;
}

// create Normal Distribution
export const normalRandom = (mean, range, iterations = 10) => {

    let sum = 0;
    for (let i = 0; i < iterations; i++) {
        sum += Math.random();
    }
    // sum / iterations gives a value between 0 and 1, centered at 0.5
    const baseline = sum / iterations; 

    // Scale it to your desired mean and range
    return Math.floor(mean - (range / 2) + (baseline * range));
}

export const refinedNormalRandom = (mean, stdDev) => {

    let sum = 0;

    const N = 6;

    for(let k = 0; k < N; k++) {
        sum += Math.random();
    }

    // convert sum (0 - 6) to standard normal val (mean 0, variance 1)
    // (sum - 3) gives -3 to +3
    const standardNormal = (sum - 3) / Math.sqrt(N / 12);

    const result = Math.round(mean + (standardNormal * stdDev));

    return Math.max(0, result);
}




export const computeHaversineDistance = (lat1, lon1, lat2, lon2) => {

    const R = 6370; // approx radius of Earth assuming it a perfecth shere

    // we want lats and longs in radians
    const lat1R = lat1 * Math.PI / 180;
    const lat2R = lat2 * Math.PI / 180;

    const lon1R = lon1 * Math.PI / 180;
    const lon2R = lon2 * Math.PI / 180;

    const dLat = lat2R - lat1R;
    const dLon = lon2R - lon1R;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                Math.cos(lat1R) * Math.cos(lat2R) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
    return Math.round(R * c);
} 

export const buildDistanceMatrix = (cityCoords) => {

    const distanceMatrix = {};

    const cities = Object.keys(cityCoords);

    cities.forEach((src) => {
        // each "src" is a key in the object "matrix"
        // and it contains another object for all the destinations
        // and weights/distances
        distanceMatrix[src] = {};

        cities.forEach((dest) => {
        const [lat1, lon1] = cityCoords[src];
        const [lat2, lon2] = cityCoords[dest];

        distanceMatrix[src][dest] = computeHaversineDistance(lat1, lon1, lat2, lon2);
        })
    })
        
    return distanceMatrix;
}

export const getCorrelation = (x, y) => {

  const n = x.length;
  const muX = x.reduce((a, b) => a + b, 0) / n;
  const muY = y.reduce((a, b) => a + b, 0) / n;

  const num = x.reduce((acc, val, i) => acc + (val - muX) * (y[i] - muY), 0);
  const den = Math.sqrt(
    x.reduce((acc, val) => acc + Math.pow(val - muX, 2), 0) *
    y.reduce((acc, val) => acc + Math.pow(val - muY, 2), 0)
  );

  return den === 0 ? 0 : num / den; 
}


export const isStrictInteger = (num) => {

    let n = Number(num);

    if (Number.isNaN(n)) {
        return false;
    }

    return Number.isInteger(n);
}

