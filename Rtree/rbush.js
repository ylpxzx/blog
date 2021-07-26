!(function (t, i) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = i())
    : 'function' == typeof define && define.amd
    ? define(i)
    : ((t = t || self).RBush = i())
})(this, function () {
  'use strict'
  function t(t, r, e, a, h) {
    !(function t(n, r, e, a, h) {
      for (; a > e; ) {
        if (a - e > 600) {
          var o = a - e + 1,
            s = r - e + 1,
            l = Math.log(o),
            f = 0.5 * Math.exp((2 * l) / 3),
            u =
              0.5 * Math.sqrt((l * f * (o - f)) / o) * (s - o / 2 < 0 ? -1 : 1),
            m = Math.max(e, Math.floor(r - (s * f) / o + u)),
            c = Math.min(a, Math.floor(r + ((o - s) * f) / o + u))
          t(n, r, m, c, h)
        }
        var p = n[r],
          d = e,
          x = a
        for (i(n, e, r), h(n[a], p) > 0 && i(n, e, a); d < x; ) {
          for (i(n, d, x), d++, x--; h(n[d], p) < 0; ) d++
          for (; h(n[x], p) > 0; ) x--
        }
        0 === h(n[e], p) ? i(n, e, x) : i(n, ++x, a),
          x <= r && (e = x + 1),
          r <= x && (a = x - 1)
      }
    })(t, r, e || 0, a || t.length - 1, h || n)
  }
  function i(t, i, n) {
    var r = t[i]
    ;(t[i] = t[n]), (t[n] = r)
  }
  function n(t, i) {
    return t < i ? -1 : t > i ? 1 : 0
  }
  var r = function (t) {
    void 0 === t && (t = 9),
      (this._maxEntries = Math.max(4, t)),
      (this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries))),
      this.clear()
  }
  function e(t, i, n) {
    if (!n) return i.indexOf(t)
    for (var r = 0; r < i.length; r++) if (n(t, i[r])) return r
    return -1
  }
  function a(t, i) {
    h(t, 0, t.children.length, i, t)
  }
  function h(t, i, n, r, e) {
    e || (e = p(null)),
      (e.minX = 1 / 0),
      (e.minY = 1 / 0),
      (e.maxX = -1 / 0),
      (e.maxY = -1 / 0)
    for (var a = i; a < n; a++) {
      var h = t.children[a]
      o(e, t.leaf ? r(h) : h)
    }
    return e
  }
  function o(t, i) {
    return (
      (t.minX = Math.min(t.minX, i.minX)),
      (t.minY = Math.min(t.minY, i.minY)),
      (t.maxX = Math.max(t.maxX, i.maxX)),
      (t.maxY = Math.max(t.maxY, i.maxY)),
      t
    )
  }
  function s(t, i) {
    return t.minX - i.minX
  }
  function l(t, i) {
    return t.minY - i.minY
  }
  function f(t) {
    return (t.maxX - t.minX) * (t.maxY - t.minY)
  }
  function u(t) {
    return t.maxX - t.minX + (t.maxY - t.minY)
  }
  function m(t, i) {
    return (
      t.minX <= i.minX &&
      t.minY <= i.minY &&
      i.maxX <= t.maxX &&
      i.maxY <= t.maxY
    )
  }
  function c(t, i) {
    return (
      i.minX <= t.maxX &&
      i.minY <= t.maxY &&
      i.maxX >= t.minX &&
      i.maxY >= t.minY
    )
  }
  function p(t) {
    return {
      children: t,
      height: 1,
      leaf: !0,
      minX: 1 / 0,
      minY: 1 / 0,
      maxX: -1 / 0,
      maxY: -1 / 0,
    }
  }
  function d(i, n, r, e, a) {
    for (var h = [n, r]; h.length; )
      if (!((r = h.pop()) - (n = h.pop()) <= e)) {
        var o = n + Math.ceil((r - n) / e / 2) * e
        t(i, o, n, r, a), h.push(n, o, o, r)
      }
  }
  return (
    (r.prototype.all = function () {
      return this._all(this.data, [])
    }),
    (r.prototype.search = function (t) {
      var i = this.data,
        n = []
      if (!c(t, i)) return n
      for (var r = this.toBBox, e = []; i; ) {
        for (var a = 0; a < i.children.length; a++) {
          var h = i.children[a],
            o = i.leaf ? r(h) : h
          c(t, o) &&
            (i.leaf ? n.push(h) : m(t, o) ? this._all(h, n) : e.push(h))
        }
        i = e.pop()
      }
      return n
    }),
    (r.prototype.collides = function (t) {
      var i = this.data
      if (!c(t, i)) return !1
      for (var n = []; i; ) {
        for (var r = 0; r < i.children.length; r++) {
          var e = i.children[r],
            a = i.leaf ? this.toBBox(e) : e
          if (c(t, a)) {
            if (i.leaf || m(t, a)) return !0
            n.push(e)
          }
        }
        i = n.pop()
      }
      return !1
    }),
    (r.prototype.load = function (t) {
      if (!t || !t.length) return this
      if (t.length < this._minEntries) {
        for (var i = 0; i < t.length; i++) this.insert(t[i])
        return this
      }
      var n = this._build(t.slice(), 0, t.length - 1, 0)
      if (this.data.children.length)
        if (this.data.height === n.height) this._splitRoot(this.data, n)
        else {
          if (this.data.height < n.height) {
            var r = this.data
            ;(this.data = n), (n = r)
          }
          this._insert(n, this.data.height - n.height - 1, !0)
        }
      else this.data = n
      return this
    }),
    (r.prototype.insert = function (t) {
      return t && this._insert(t, this.data.height - 1), this
    }),
    (r.prototype.clear = function () {
      return (this.data = p([])), this
    }),
    (r.prototype.remove = function (t, i) {
      if (!t) return this
      for (
        var n, r, a, h = this.data, o = this.toBBox(t), s = [], l = [];
        h || s.length;

      ) {
        if (
          (h || ((h = s.pop()), (r = s[s.length - 1]), (n = l.pop()), (a = !0)),
          h.leaf)
        ) {
          var f = e(t, h.children, i)
          if (-1 !== f)
            return h.children.splice(f, 1), s.push(h), this._condense(s), this
        }
        a || h.leaf || !m(h, o)
          ? r
            ? (n++, (h = r.children[n]), (a = !1))
            : (h = null)
          : (s.push(h), l.push(n), (n = 0), (r = h), (h = h.children[0]))
      }
      return this
    }),
    (r.prototype.toBBox = function (t) {
      return t
    }),
    (r.prototype.compareMinX = function (t, i) {
      return t.minX - i.minX
    }),
    (r.prototype.compareMinY = function (t, i) {
      return t.minY - i.minY
    }),
    (r.prototype.toJSON = function () {
      return this.data
    }),
    (r.prototype.fromJSON = function (t) {
      return (this.data = t), this
    }),
    (r.prototype._all = function (t, i) {
      for (var n = []; t; )
        t.leaf ? i.push.apply(i, t.children) : n.push.apply(n, t.children),
          (t = n.pop())
      return i
    }),
    (r.prototype._build = function (t, i, n, r) {
      var e,
        h = n - i + 1,
        o = this._maxEntries
      if (h <= o) return a((e = p(t.slice(i, n + 1))), this.toBBox), e
      r ||
        ((r = Math.ceil(Math.log(h) / Math.log(o))),
        (o = Math.ceil(h / Math.pow(o, r - 1)))),
        ((e = p([])).leaf = !1),
        (e.height = r)
      var s = Math.ceil(h / o),
        l = s * Math.ceil(Math.sqrt(o))
      d(t, i, n, l, this.compareMinX)
      for (var f = i; f <= n; f += l) {
        var u = Math.min(f + l - 1, n)
        d(t, f, u, s, this.compareMinY)
        for (var m = f; m <= u; m += s) {
          var c = Math.min(m + s - 1, u)
          e.children.push(this._build(t, m, c, r - 1))
        }
      }
      return a(e, this.toBBox), e
    }),
    (r.prototype._chooseSubtree = function (t, i, n, r) {
      for (; r.push(i), !i.leaf && r.length - 1 !== n; ) {
        for (
          var e = 1 / 0, a = 1 / 0, h = void 0, o = 0;
          o < i.children.length;
          o++
        ) {
          var s = i.children[o],
            l = f(s),
            u =
              ((m = t),
              (c = s),
              (Math.max(c.maxX, m.maxX) - Math.min(c.minX, m.minX)) *
                (Math.max(c.maxY, m.maxY) - Math.min(c.minY, m.minY)) -
                l)
          u < a
            ? ((a = u), (e = l < e ? l : e), (h = s))
            : u === a && l < e && ((e = l), (h = s))
        }
        i = h || i.children[0]
      }
      var m, c
      return i
    }),
    (r.prototype._insert = function (t, i, n) {
      var r = n ? t : this.toBBox(t),
        e = [],
        a = this._chooseSubtree(r, this.data, i, e)
      for (
        a.children.push(t), o(a, r);
        i >= 0 && e[i].children.length > this._maxEntries;

      )
        this._split(e, i), i--
      this._adjustParentBBoxes(r, e, i)
    }),
    (r.prototype._split = function (t, i) {
      var n = t[i],
        r = n.children.length,
        e = this._minEntries
      this._chooseSplitAxis(n, e, r)
      var h = this._chooseSplitIndex(n, e, r),
        o = p(n.children.splice(h, n.children.length - h))
      ;(o.height = n.height),
        (o.leaf = n.leaf),
        a(n, this.toBBox),
        a(o, this.toBBox),
        i ? t[i - 1].children.push(o) : this._splitRoot(n, o)
    }),
    (r.prototype._splitRoot = function (t, i) {
      ;(this.data = p([t, i])),
        (this.data.height = t.height + 1),
        (this.data.leaf = !1),
        a(this.data, this.toBBox)
    }),
    (r.prototype._chooseSplitIndex = function (t, i, n) {
      for (
        var r, e, a, o, s, l, u, m = 1 / 0, c = 1 / 0, p = i;
        p <= n - i;
        p++
      ) {
        var d = h(t, 0, p, this.toBBox),
          x = h(t, p, n, this.toBBox),
          v =
            ((e = d),
            (a = x),
            (o = void 0),
            (s = void 0),
            (l = void 0),
            (u = void 0),
            (o = Math.max(e.minX, a.minX)),
            (s = Math.max(e.minY, a.minY)),
            (l = Math.min(e.maxX, a.maxX)),
            (u = Math.min(e.maxY, a.maxY)),
            Math.max(0, l - o) * Math.max(0, u - s)),
          M = f(d) + f(x)
        v < m
          ? ((m = v), (r = p), (c = M < c ? M : c))
          : v === m && M < c && ((c = M), (r = p))
      }
      return r || n - i
    }),
    (r.prototype._chooseSplitAxis = function (t, i, n) {
      var r = t.leaf ? this.compareMinX : s,
        e = t.leaf ? this.compareMinY : l
      this._allDistMargin(t, i, n, r) < this._allDistMargin(t, i, n, e) &&
        t.children.sort(r)
    }),
    (r.prototype._allDistMargin = function (t, i, n, r) {
      t.children.sort(r)
      for (
        var e = this.toBBox,
          a = h(t, 0, i, e),
          s = h(t, n - i, n, e),
          l = u(a) + u(s),
          f = i;
        f < n - i;
        f++
      ) {
        var m = t.children[f]
        o(a, t.leaf ? e(m) : m), (l += u(a))
      }
      for (var c = n - i - 1; c >= i; c--) {
        var p = t.children[c]
        o(s, t.leaf ? e(p) : p), (l += u(s))
      }
      return l
    }),
    (r.prototype._adjustParentBBoxes = function (t, i, n) {
      for (var r = n; r >= 0; r--) o(i[r], t)
    }),
    (r.prototype._condense = function (t) {
      for (var i = t.length - 1, n = void 0; i >= 0; i--)
        0 === t[i].children.length
          ? i > 0
            ? (n = t[i - 1].children).splice(n.indexOf(t[i]), 1)
            : this.clear()
          : a(t[i], this.toBBox)
    }),
    r
  )
})
