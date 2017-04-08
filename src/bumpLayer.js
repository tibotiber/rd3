// Inspired by Lee Byron's test data generator.
function bumpLayer (n, o) {
  var bump = a => {
    var x = 1 / (0.1 + Math.random())
    var y = 2 * Math.random() - 0.5
    var z = 10 / (0.1 + Math.random())
    for (var i = 0; i < n; i++) {
      var w = (i / n - y) * z
      a[i] += x * Math.exp(-w * w)
    }
  }

  var a = []
  var i
  for (i = 0; i < n; ++i) {
    a[i] = o + o * Math.random()
  }
  for (i = 0; i < 5; ++i) {
    bump(a)
  }
  return a.map((d, i) => {
    return { x: i, y: Math.max(0, d) }
  })
}

export default bumpLayer
