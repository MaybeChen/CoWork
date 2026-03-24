export function createComponentRegistry(initial = {}) {
  const map = new Map(Object.entries(initial))

  return {
    register(type, component) {
      if (!type || typeof type !== 'string') throw new Error('Component type must be a string')
      map.set(type, component)
    },
    registerMany(entries) {
      for (const [type, component] of Object.entries(entries)) {
        map.set(type, component)
      }
    },
    resolve(type) {
      return map.get(type) ?? null
    },
    has(type) {
      return map.has(type)
    },
    entries() {
      return Array.from(map.entries())
    },
  }
}
