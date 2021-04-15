//detectPeaks = ƒ(data, accessor, options)

function detectPeaks(data, accessor, options) {
  let {lookaround, sensitivity, coalesce, full} = Object.assign({
    lookaround: 2,
    sensitivity: 1.4,
    coalesce: 0,
    full: false
  }, options || accessor)
  
  let values = typeof accessor == "function" ? data.map(accessor) : data

  // Compute a peakiness score for every sample value in `data`
  // We normalize the scale of the scores by mean-centering and dividing by the standard deviation
  // to get a dimensionless quantity such that can be used as a sensitivity parameter
  // across different scales of data (s. t. normalize(x) == normalize(k*x))
  let scores = normalize(
    values.map(
      (value, index) => peakiness(
        values.slice(Math.max(0, index - lookaround), index),
        value,
        values.slice(index + 1, index + lookaround + 1)
      )
    )
  )

  // Candidate peaks are indices whose score is above the sensitivity threshold
  let candidates = d3.range(scores.length).filter(index => scores[index] > sensitivity)

  // If we have multiple peaks, coalesce those that are close together
  let groups = candidates.length ? [[candidates[0]]] : []
  d3.pairs(candidates).forEach(([a, b]) => {
    if (b - a < coalesce) {
      groups[groups.length - 1].push(b)
    } else {
      groups.push([b])
    }
  })

  // Represent every group of peaks by the highest peak in the group
  let peaks = groups.map(
    group => group[d3.scan(group, (a, b) => values[b] - values[a])]
  )

  return full ? { data, values, scores, candidates, groups, peaks } : peaks
}

//peakiness = ƒ(left, value, right)

// Assigns a spikiness score to `value`, based on its left and right neighbors
peakiness = (left, value, right) => {
  // assume zero outside the boundary
  return value - d3.max([d3.min(left) || 0, d3.min(right) || 0]) // this can be max or mean.
}

//normalize = ƒ(xs)

normalize = xs => {
  let mean = d3.mean(xs)
  let stdev = d3.deviation(xs)
  return xs.map(x => (x - mean) / stdev)
}