export function parseDockerMetrics(metricsString) {
  const metrics = {};
  const pairs = metricsString.split(',');

  pairs.forEach(pair => {
    const [key, value] = pair.split(':').map(item => item.trim());
    
    // Remove quotes if present
    const cleanKey = key.replace(/"/g, '');
    let cleanValue = value.replace(/"/g, '');

    // Convert numerical values
    if (cleanValue.includes('%')) {
      cleanValue = parseFloat(cleanValue.replace('%', ''));
    } else if (cleanValue.includes('B') || cleanValue.includes('iB')) {
      // Handle memory/IO values
      const [num, unit] = cleanValue.split(/\s*\/\s*/).map(item => item.trim());
      cleanValue = {
        current: num,
        max: unit || null
      };
    } else if (!isNaN(cleanValue)) {
      cleanValue = Number(cleanValue);
    }

    metrics[cleanKey] = cleanValue;
  });

  return metrics;
}

