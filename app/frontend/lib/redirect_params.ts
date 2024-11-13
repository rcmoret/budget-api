const buildQueryParams = (segments: Array<string | number>) => {
  return segments.map((segment) => {
    return [
      "redirect[segments][]",
      segment
    ].map((str) => encodeURIComponent(str)).join("=")
  }).join("&")
}

export { buildQueryParams }
