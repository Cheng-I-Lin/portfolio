console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// let navLinks = $$("nav a");

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname,
//   );

// currentLink?.classList.add('current');


const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/portfolio/";         // GitHub Pages repo name

let pages = [
    { url: '', title: 'Home' },
    { url: 'resume/', title: 'Resume' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'https://github.com/Cheng-I-Lin', title: 'Github' }
];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    url = !url.startsWith('http') ? BASE_PATH + url : url;
    
    // Create link and add it to nav
    //nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    } else if (a.host != location.host) {
        a.target = "_blank";
    }
}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
      <label class="color-scheme">
          Theme:
          <select>
              <!-- TODO add <option> elements here -->
            <option value="light dark">Automatic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
      </label>`,
);

function setColorScheme(colorScheme){
    document.documentElement.style.setProperty('color-scheme', colorScheme);
}

let select=document.querySelector('select');

select.addEventListener('input', function (event) {
    localStorage.colorScheme = event.target.value;
    setColorScheme(event.target.value);
    //console.log('color scheme changed to', event.target.value);
});

if ("colorScheme" in localStorage){
    setColorScheme(localStorage.colorScheme);
    select.value=localStorage.colorScheme;
}

let form=document.querySelector('form');

form?.addEventListener('submit', function (event) {
    event.preventDefault();
    let data = new FormData(form);
    let arr=[];
    for (let [name, value] of data) {
        // TODO build URL parameters here
        arr.push(`${name}=${encodeURIComponent(value)}`);
        console.log(name, encodeURIComponent(value));
    }
    let url=`${form.action}?${arr.join('&')}`;
    location.href = url;
});

export async function fetchJSON(url) {
    try {
      // Fetch the JSON file from the given URL
      const response = await fetch(url);
      console.log(response)
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching or parsing JSON data:', error);
    }
  }

  export function renderProjects(project, containerElement, headingLevel = 'h2') {
    // Your code will go here
    containerElement.innerHTML = '';
    project.forEach(p => {
        const article = document.createElement('article');
        article.innerHTML = `
            <${headingLevel}>${p.title}</${headingLevel}>
            <img src="${p.image}" alt="${p.title}">
            <p>${p.description}</p>
        `;
        containerElement.appendChild(article);
    });
  }