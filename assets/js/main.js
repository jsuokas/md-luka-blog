const availableTags = jekyll.tags || []

const filters = (() => {
  const applyFilters = () => {
    const urlParams = new URLSearchParams(window.location.search)

    const urlFilters = (urlParams.get('filters') || '')
      .split(' ')
      .filter(it => it !== '')
      .filter(it => availableTags.includes(it))
    
    const filterItems = document.querySelectorAll('[data-filter]') || []

    const elementsToHide = urlFilters.length !== 0 ?
      [...filterItems]
        .map(element => ({
          element,
          filters: element.getAttribute('data-filter').split(' ')
        }))
        .map(({ element, filters }) => ({
          element,
          show: filters.some((filter) => urlFilters.includes(filter))
        }))
        .filter(({ show }) => show === false)
        .map(({ element }) => element)
      : []
    
    // TODO: Use shadow DOM instead with the element and actually remove them from real dom
    filterItems.forEach((element) => {
      element.style.display = 'block'
    })

    elementsToHide.forEach(element => {
      element.style.display = 'none'
    })
  }

  const onTagCloudItemClick = (e) => {
    e.preventDefault()

    const target = e.target
    const tag = encodeURIComponent(target.dataset.tag)
    const urlParams = new URLSearchParams(window.location.search)
    const locationWithoutParams = window.location.href.split('?')[0]
    
    target.classList.toggle('active')
    
    if (urlParams.has('filters')) {
      const appliedFilters = urlParams.get('filters')
      const includesTagAlready = appliedFilters.includes(tag)
      
      if (includesTagAlready) {
        const isFirstFilter = appliedFilters.indexOf(tag) === 0
        const newAppliedFilters = isFirstFilter
          ? appliedFilters.replace(tag, '')
          : appliedFilters.replace(`+${tag}`, '')

          if (newAppliedFilters.length === 0) {
            urlParams.delete('filters')
          } else {
            urlParams.set('filters', newAppliedFilters.replace(/^\+/, ''))
          }
      } else {
        urlParams.set('filters', `${appliedFilters}+${tag}`)
      }
    } else {
      urlParams.set('filters', tag)
    }

    history.replaceState(null, '', `${locationWithoutParams}?${urlParams}`)

    applyFilters()
  }

  const addTagCloudListeners = () => {
    const tagCloudItems = document.querySelectorAll('[data-tag]') || []
    const enumerableTagCloudItems = [...tagCloudItems]

    enumerableTagCloudItems.forEach((tagCloudItem) => {
      tagCloudItem.addEventListener('click', onTagCloudItemClick)
    })
  }

  return {
    init: () => {
      applyFilters()
      addTagCloudListeners()
    }
  }
})()