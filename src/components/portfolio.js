import m from 'mithril'

const hasRepos = () => {
  let age = parseInt(localStorage.getItem("repos-date"))
  let now = Date.now()

  return (now - age) / 1000 >= 3600
    ? (localStorage.clear("repos"), null)
    : localStorage.getItem("repos")
}

const fetchRepos = (mdl) => {
  mdl.portfolio.reposList = JSON.parse(hasRepos())
  return mdl.portfolio.reposList
}
const saveRepos = (repos) => {
  localStorage.setItem("repos-date", JSON.stringify(Date.now()))
  localStorage.setItem("repos", JSON.stringify(repos))
  return repos
}

const hasRepo = (name) => localStorage.getItem(name)
const fetchRepo = (name) => JSON.parse(hasRepo(name))
const saveRepo = (name) => (repo) => {
  localStorage.setItem(name, JSON.stringify(repo))
  return repo
}

const handler = (entry) =>
  entry.forEach(
    (change) => (change.target.style.opacity = change.isIntersecting ? 1 : 0)
  )

const opacityObs = new IntersectionObserver(handler)



const getRepos = (mdl) => {
  return hasRepos()
    ? Promise.resolve(fetchRepos(mdl))
    : m
      .request({
        url: "https://api.github.com/users/boazblake/repos?sort=asc&per_page=100",
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      })
      .then(saveRepos)
}

const getRepo = (state) => {
  return hasRepo(state.name)
    ? Promise.resolve(fetchRepo(state.name))
    : m
      .request({
        url: `https://api.github.com/repos/boazblake/${state.name}`,
      })
      .then(saveRepo(state.name))
}

const Repo = () => {
  const state = {
    name: "",
    status: "loading",
  }
  return {
    oninit: ({ attrs: { mdl, url } }) => {
      state.name = url.split("/")[3]
      getRepo(state).then(
        ({ description }) => {
          state.errors = null
          state.info = description && description.split("~")[0]
          state.src = description && description.split("~")[1]
          state.status = "loaded"
          mdl.portfolio.repos[state.name] = { description }
          hasRepo(state.name) && m.redraw()
        },
        (errors) => {
          state.status = "failed"
          state.errors = errors
        }
      )
    },
    view: () => {
      return (
        state.status == "loading" && "Repo Loading...",
        state.status == "failed" && "Error",
        state.status == "loaded" &&
        m(
          "a.w3-col s12 m6 l4",
          {
            href: `https://boazblake.github.io/${state.name}`,
            target: "_blank",
            oncreate: ({ dom }) =>
              state.status == "loaded" && opacityObs.observe(dom),
            style: { opacity: 1 },
          },
          m(
            ".w3-cell.w3-padding-small",
            m('h2', state.name),
            m("img", { style: { maxWidth: "80%" }, src: state.src }),
            m(".info", state.info),
          )
        )
      )
    },
  }
}

const Portfolio = () => {
  const state = {
    status: "loading",
    errors: {},
  }

  return {
    oninit: ({ attrs: { mdl } }) =>
      getRepos(mdl)
        .then((repos) =>
          repos
            .filter((repo) => {
              return (
                repo.homepage &&
                repo.homepage.includes("boazblake") &&
                repo.description &&
                repo.description.split("~")[1]
              )
            })
            .map((repo) => repo.homepage)
        )
        .then(
          (repos) => {
            mdl.portfolio.reposList = repos
            state.status = "loaded"
            hasRepos() && m.redraw()
          },
          (errors) => {
            state.status = "failed"
            state.errors = errors
          }
        ),
    view: ({ attrs: { mdl } }) =>
      m(
        ".w3-container",
        m('h1', 'Projects'),
        m('h2.w3-center', 'Click through to visit these projects'),
        state.status == "failed" && "Error fetching Repos ...",
        state.status == "loading" && m('.w3-panel', "Loading Repos ..."),
        state.status == "loaded" &&
        m('.w3-row.w3-grid.overflow', {
          style: { height: '80vh' }
        },
          m('picture.w3-block', m('img', { style: { minWidth: '80%', maxWidth: '400px', height: 'auto', }, src: 'images/baca.webp' }), m('p', 'Neighborhood Civic Association website that I am webmaster of. Created using mithriljs and expressjs')),
          mdl.portfolio.reposList.map((url) => m(Repo, { url, mdl }))
        )
      ),
  }
}


export { Portfolio }
