export function extractJsonObjects(input) {
  const objects = []
  let depth = 0
  let start = -1
  let inString = false
  let escaped = false
  let lastConsumedIndex = 0

  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i]

    if (inString) {
      if (escaped) escaped = false
      else if (ch === '\\') escaped = true
      else if (ch === '"') inString = false
      continue
    }

    if (ch === '"') {
      inString = true
      continue
    }

    if (ch === '{') {
      if (depth === 0) start = i
      depth += 1
      continue
    }

    if (ch === '}') {
      depth -= 1
      if (depth === 0 && start >= 0) {
        objects.push(input.slice(start, i + 1))
        lastConsumedIndex = i + 1
        start = -1
      }
    }
  }

  return {
    objects,
    remainder: input.slice(lastConsumedIndex),
  }
}
