'use strict';

class EmitStatsPlugin {
  constructor(opts) {
    opts = opts || {};
    this.opts = {};
    if (typeof opts.onEmit !== 'function') {
      throw new Error('onEmit');
    }
    this.opts.onEmit = opts.onEmit;
  }

  apply(compiler) {
    if (compiler.hooks) {
      compiler.hooks.emit.tapPromise(
        'emit-stats-plugin',
        this.emitStats.bind(this)
      );
    } else {
      compiler.plugin('emit', this.emitStats.bind(this));
    }
  }

  emitStats(curCompiler) {
    const stats = curCompiler.getStats().toJson();

    const result = this.opts.onEmit(stats);

    if (result && result.then) {
      return result;
    }
    return Promise.resolve();
  }
}

module.exports = EmitStatsPlugin;
