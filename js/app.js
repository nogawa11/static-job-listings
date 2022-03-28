const jobListings = document.querySelector('.job-listings');
const filterList = document.querySelector('.filter-list');
const buttonClear = document.querySelector('.button-clear');
let filters = [];

const toHTML = (data) => {
  return `
    <div class="job-listing ${data.featured}">
      <div class="job-info">
        <img class="logo" src="${data.logo}" alt="${data.company}">
        <div class="job-text">
          <div class="company">
            <h5>
              ${data.company}
              <span class="tag-new ${data.new}">NEW!</span>
              <span class="tag-featured ${data.featured}">FEATURED</span>
            </h5>
          </div>
          <div class="job-role">
            <a href="#">${data.title}</a>
          </div>
          <div class="job-details">
            <p>
              <span>${data.posted} •</span>
              <span>${data.type} •</span>
              <span>${data.location}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="job-filters">
        <div class="filter" data-role="${data.role}">${data.role}</div>
        <div class="filter" data-level="${data.level}">${data.level}</div>
        ${languagesToHTML(data.languages)}
        ${toolsToHTML(data.tools)}
      </div>
    </div>
  `
};

const languagesToHTML = (arr) => {
  if (!arr) {
    return '';
  }
  return arr.map(lang => `<div class="filter" data-languages="${lang}">${lang}</div>`).join('');
}

const toolsToHTML = (arr) => {
  if (!arr) {
    return '';
  }
  return arr.map(tool => `<div class="filter" data-tools="${tool}">${tool}</div>`).join('');
}


const render = (data) => {
  const html = data.map(toHTML).join('');
  jobListings.innerHTML = html;
}

render(jobData);

const addFilter = (filter) => {
  document.querySelector('.filter-field').classList.add('active');
  jobListings.classList.add('active')
  const html = `
    <div class="filters">
        <div class="filter">${filter}</div>
        <div class="button-remove"><img src="images/icon-remove.svg" alt="remove" data-remove="remove"></div>
    </div>`;
  filterList.insertAdjacentHTML('beforeend', html);
  buttonClear.classList.add('active')
}

const filterListing = (arrFilters, arrData) => {
  const newData = arrData.filter(value => {
    let arrFilterValues = [value.role, value.level, ...value.languages || [], ...value.tools || []];
    return arrFilters.every(item => arrFilterValues.includes(item));
  })
  render(newData);
}

const removeFilter = (item, filter) => {
  filters = filters.filter(value => value !== filter);
  filterList.removeChild(item);
  if (filters.length <= 0) {
    document.querySelector('.filter-field').classList.remove('active');
    render(jobData);
    buttonClear.classList.remove('active')
    jobListings.classList.remove('active')
  } else {
    filterListing(filters, jobData);
  }
}

jobListings.addEventListener('click', event => {
  event.preventDefault();
  if (event.target.dataset.role || event.target.dataset.level || event.target.dataset.languages || event.target.dataset.tools) {
    if (!filters.includes(event.target.textContent)) {
      addFilter(event.target.textContent);
      filters.push(event.target.textContent);
      filterListing(filters, jobData);
    }
  }
});

buttonClear.addEventListener('click', event => {
  event.preventDefault();
  filters.length = 0;
  document.querySelector('.filter-field').classList.remove('active');
  filterList.innerHTML = '';
  render(jobData);
  buttonClear.classList.remove('active')
  jobListings.classList.remove('active')
});

filterList.addEventListener('click', event => {
  event.preventDefault();
  if (event.target.dataset.remove) {
    let node = event.target.parentNode.parentNode;
    let removeFilterName = node.querySelector('.filter').textContent;
    removeFilter(node, removeFilterName);
  }
});
