//@ts-ignore
/* eslint-disable */

var kzg = (() => {
  var _scriptDir = import.meta.url;

  return async function (moduleArg = {}) {
    var c = moduleArg,
      m,
      p;
    c.ready = new Promise((a, b) => {
      m = a;
      p = b;
    });
    var u = Object.assign({}, c),
      v = "object" == typeof window,
      x = "function" == typeof importScripts,
      y =
        "object" == typeof process &&
        "object" == typeof process.versions &&
        "string" == typeof process.versions.node,
      z = "",
      A,
      B,
      C;
    if (y) {
      // const { createRequire: a } = await import("module");
      // var require = a(import.meta.url),
      //   fs = require("fs"),
      //   D = require("path");
      // x
      //   ? (z = D.dirname(z) + "/")
      //   : (z = require("url").fileURLToPath(new URL("./", import.meta.url)));
      // A = (b, d) => {
      //   b = E(b) ? new URL(b) : D.normalize(b);
      //   return fs.readFileSync(b, d ? void 0 : "utf8");
      // };
      // C = (b) => {
      //   b = A(b, !0);
      //   b.buffer || (b = new Uint8Array(b));
      //   return b;
      // };
      // B = (b, d, e, f = !0) => {
      //   b = E(b) ? new URL(b) : D.normalize(b);
      //   fs.readFile(b, f ? void 0 : "utf8", (h, q) => {
      //     h ? e(h) : d(f ? q.buffer : q);
      //   });
      // };
      // process.argv.slice(2);
    } else if (v || x)
      x
        ? (z = self.location.href)
        : "undefined" != typeof document &&
          document.currentScript &&
          (z = document.currentScript.src),
        _scriptDir && (z = _scriptDir),
        z.startsWith("blob:")
          ? (z = "")
          : (z = z.substr(0, z.replace(/[?#].*/, "").lastIndexOf("/") + 1)),
        (A = (a) => {
          var b = new XMLHttpRequest();
          b.open("GET", a, !1);
          b.send(null);
          return b.responseText;
        }),
        x &&
          (C = (a) => {
            var b = new XMLHttpRequest();
            b.open("GET", a, !1);
            b.responseType = "arraybuffer";
            b.send(null);
            return new Uint8Array(b.response);
          }),
        (B = (a, b, d) => {
          var e = new XMLHttpRequest();
          e.open("GET", a, !0);
          e.responseType = "arraybuffer";
          e.onload = () => {
            200 == e.status || (0 == e.status && e.response)
              ? b(e.response)
              : d();
          };
          e.onerror = d;
          e.send(null);
        });
    c.print || console.log.bind(console);
    var F = c.printErr || console.error.bind(console);
    Object.assign(c, u);
    u = null;
    var G;
    c.wasmBinary && (G = c.wasmBinary);
    "object" != typeof WebAssembly && H("no native wasm support detected");
    var J,
      K = !1,
      L,
      M;
    function N() {
      var a = J.buffer;
      c.HEAP8 = L = new Int8Array(a);
      c.HEAP16 = new Int16Array(a);
      c.HEAPU8 = M = new Uint8Array(a);
      c.HEAPU16 = new Uint16Array(a);
      c.HEAP32 = new Int32Array(a);
      c.HEAPU32 = new Uint32Array(a);
      c.HEAPF32 = new Float32Array(a);
      c.HEAPF64 = new Float64Array(a);
    }
    var O = [],
      P = [],
      Q = [];
    function aa() {
      var a = c.preRun.shift();
      O.unshift(a);
    }
    var R = 0,
      S = null,
      T = null;
    function H(a) {
      c.onAbort?.(a);
      a = "Aborted(" + a + ")";
      F(a);
      K = !0;
      a = new WebAssembly.RuntimeError(
        a + ". Build with -sASSERTIONS for more info.",
      );
      p(a);
      throw a;
    }
    var ba = (a) => a.startsWith("data:application/octet-stream;base64,"),
      E = (a) => a.startsWith("file://"),
      U;
    if (c.locateFile) {
      if (((U = "../wasm/kzg.wasm"), !ba(U))) {
        var ca = U;
        U = c.locateFile ? c.locateFile(ca, z) : z + ca;
      }
    } else U = new URL("../wasm/kzg.wasm", import.meta.url).href;
    function da(a) {
      if (a == U && G) return new Uint8Array(G);
      if (C) return C(a);
      throw "both async and sync fetching of the wasm failed";
    }
    function ea(a) {
      if (!G && (v || x)) {
        if ("function" == typeof fetch && !E(a))
          return fetch(a, { credentials: "same-origin" })
            .then((b) => {
              if (!b.ok) throw `failed to load wasm binary file at '${a}'`;
              return b.arrayBuffer();
            })
            .catch(() => da(a));
        if (B)
          return new Promise((b, d) => {
            B(a, (e) => b(new Uint8Array(e)), d);
          });
      }
      return Promise.resolve().then(() => da(a));
    }
    function ha(a, b, d) {
      return ea(a)
        .then((e) => WebAssembly.instantiate(e, b))
        .then((e) => e)
        .then(d, (e) => {
          F(`failed to asynchronously prepare wasm: ${e}`);
          H(e);
        });
    }
    function ia(a, b) {
      var d = U;
      return G ||
        "function" != typeof WebAssembly.instantiateStreaming ||
        ba(d) ||
        E(d) ||
        y ||
        "function" != typeof fetch
        ? ha(d, a, b)
        : fetch(d, { credentials: "same-origin" }).then((e) =>
            WebAssembly.instantiateStreaming(e, a).then(b, function (f) {
              F(`wasm streaming compile failed: ${f}`);
              F("falling back to ArrayBuffer instantiation");
              return ha(d, a, b);
            }),
          );
    }
    var V = (a) => {
        for (; 0 < a.length; ) a.shift()(c);
      },
      ja = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0,
      W = (a) => {
        if (a) {
          for (var b = M, d = a + NaN, e = a; b[e] && !(e >= d); ) ++e;
          if (16 < e - a && b.buffer && ja) a = ja.decode(b.subarray(a, e));
          else {
            for (d = ""; a < e; ) {
              var f = b[a++];
              if (f & 128) {
                var h = b[a++] & 63;
                if (192 == (f & 224))
                  d += String.fromCharCode(((f & 31) << 6) | h);
                else {
                  var q = b[a++] & 63;
                  f =
                    224 == (f & 240)
                      ? ((f & 15) << 12) | (h << 6) | q
                      : ((f & 7) << 18) | (h << 12) | (q << 6) | (b[a++] & 63);
                  65536 > f
                    ? (d += String.fromCharCode(f))
                    : ((f -= 65536),
                      (d += String.fromCharCode(
                        55296 | (f >> 10),
                        56320 | (f & 1023),
                      )));
                }
              } else d += String.fromCharCode(f);
            }
            a = d;
          }
        } else a = "";
        return a;
      },
      ma = (a, b, d, e) => {
        var f = {
          string: (k) => {
            var r = 0;
            if (null !== k && void 0 !== k && 0 !== k) {
              for (var g = (r = 0); g < k.length; ++g) {
                var n = k.charCodeAt(g);
                127 >= n
                  ? r++
                  : 2047 >= n
                    ? (r += 2)
                    : 55296 <= n && 57343 >= n
                      ? ((r += 4), ++g)
                      : (r += 3);
              }
              var t = r + 1;
              g = r = X(t);
              n = M;
              if (0 < t) {
                t = g + t - 1;
                for (var I = 0; I < k.length; ++I) {
                  var l = k.charCodeAt(I);
                  if (55296 <= l && 57343 >= l) {
                    var na = k.charCodeAt(++I);
                    l = (65536 + ((l & 1023) << 10)) | (na & 1023);
                  }
                  if (127 >= l) {
                    if (g >= t) break;
                    n[g++] = l;
                  } else {
                    if (2047 >= l) {
                      if (g + 1 >= t) break;
                      n[g++] = 192 | (l >> 6);
                    } else {
                      if (65535 >= l) {
                        if (g + 2 >= t) break;
                        n[g++] = 224 | (l >> 12);
                      } else {
                        if (g + 3 >= t) break;
                        n[g++] = 240 | (l >> 18);
                        n[g++] = 128 | ((l >> 12) & 63);
                      }
                      n[g++] = 128 | ((l >> 6) & 63);
                    }
                    n[g++] = 128 | (l & 63);
                  }
                }
                n[g] = 0;
              }
            }
            return r;
          },
          array: (k) => {
            var r = X(k.length);
            L.set(k, r);
            return r;
          },
        };
        a = c["_" + a];
        var h = [],
          q = 0;
        if (e)
          for (var w = 0; w < e.length; w++) {
            var fa = f[d[w]];
            fa ? (0 === q && (q = ka()), (h[w] = fa(e[w]))) : (h[w] = e[w]);
          }
        d = a.apply(null, h);
        return (d = (function (k) {
          0 !== q && la(q);
          return "string" === b ? W(k) : "boolean" === b ? !!k : k;
        })(d));
      },
      oa = {
        c: (a, b, d, e) => {
          H(
            `Assertion failed: ${W(a)}, at: ` +
              [b ? W(b) : "unknown filename", d, e ? W(e) : "unknown function"],
          );
        },
        b: (a, b, d) => M.copyWithin(a, b, b + d),
        a: (a) => {
          var b = M.length;
          a >>>= 0;
          if (2147483648 < a) return !1;
          for (var d = 1; 4 >= d; d *= 2) {
            var e = b * (1 + 0.2 / d);
            e = Math.min(e, a + 100663296);
            var f = Math;
            e = Math.max(a, e);
            a: {
              f =
                (f.min.call(
                  f,
                  2147483648,
                  e + ((65536 - (e % 65536)) % 65536),
                ) -
                  J.buffer.byteLength +
                  65535) /
                65536;
              try {
                J.grow(f);
                N();
                var h = 1;
                break a;
              } catch (q) {}
              h = void 0;
            }
            if (h) return !0;
          }
          return !1;
        },
      },
      Y = (function () {
        function a(d) {
          Y = d.exports;
          J = Y.d;
          N();
          P.unshift(Y.e);
          R--;
          c.monitorRunDependencies?.(R);
          0 == R &&
            (null !== S && (clearInterval(S), (S = null)),
            T && ((d = T), (T = null), d()));
          return Y;
        }
        var b = { a: oa };
        R++;
        c.monitorRunDependencies?.(R);
        if (c.instantiateWasm)
          try {
            return c.instantiateWasm(b, a);
          } catch (d) {
            F(`Module.instantiateWasm callback failed with error: ${d}`), p(d);
          }
        ia(b, function (d) {
          a(d.instance);
        }).catch(p);
        return {};
      })();
    c._load_trusted_setup_from_wasm = (a, b, d, e) =>
      (c._load_trusted_setup_from_wasm = Y.f)(a, b, d, e);
    c._free_trusted_setup_wasm = () => (c._free_trusted_setup_wasm = Y.g)();
    c._blob_to_kzg_commitment_wasm = (a) =>
      (c._blob_to_kzg_commitment_wasm = Y.h)(a);
    c._compute_blob_kzg_proof_wasm = (a, b) =>
      (c._compute_blob_kzg_proof_wasm = Y.i)(a, b);
    c._verify_blob_kzg_proof_wasm = (a, b, d) =>
      (c._verify_blob_kzg_proof_wasm = Y.j)(a, b, d);
    c._verify_kzg_proof_wasm = (a, b, d, e) =>
      (c._verify_kzg_proof_wasm = Y.k)(a, b, d, e);
    var ka = () => (ka = Y.m)(),
      la = (a) => (la = Y.n)(a),
      X = (a) => (X = Y.o)(a);
    c.cwrap = (a, b, d, e) => {
      var f = !d || d.every((h) => "number" === h || "boolean" === h);
      return "string" !== b && f && !e
        ? c["_" + a]
        : function () {
            return ma(a, b, d, arguments);
          };
    };
    var Z;
    T = function pa() {
      Z || qa();
      Z || (T = pa);
    };
    function qa() {
      function a() {
        if (!Z && ((Z = !0), (c.calledRun = !0), !K)) {
          V(P);
          m(c);
          if (c.onRuntimeInitialized) c.onRuntimeInitialized();
          if (c.postRun)
            for (
              "function" == typeof c.postRun && (c.postRun = [c.postRun]);
              c.postRun.length;

            ) {
              var b = c.postRun.shift();
              Q.unshift(b);
            }
          V(Q);
        }
      }
      if (!(0 < R)) {
        if (c.preRun)
          for (
            "function" == typeof c.preRun && (c.preRun = [c.preRun]);
            c.preRun.length;

          )
            aa();
        V(O);
        0 < R ||
          (c.setStatus
            ? (c.setStatus("Running..."),
              setTimeout(function () {
                setTimeout(function () {
                  c.setStatus("");
                }, 1);
                a();
              }, 1))
            : a());
      }
    }
    if (c.preInit)
      for (
        "function" == typeof c.preInit && (c.preInit = [c.preInit]);
        0 < c.preInit.length;

      )
        c.preInit.pop()();
    qa();

    return moduleArg.ready;
  };
})();
export default kzg;
