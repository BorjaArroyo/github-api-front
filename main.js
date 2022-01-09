const githubAPIURL = "https://api.github.com"

// Search bar
const searchBar = document.querySelector("form")

searchBar.addEventListener("submit", (event) => {
    event.preventDefault()
    const username = searchBar.firstElementChild.value
    getUserData(username)
    searchBar.firstElementChild.value = ""

})

async function getUserData(username) {
    try {
        const userRequest = await fetch(`${githubAPIURL}/users/${username}`)

        if (!userRequest.ok) {
            throw new Error(userRequest.status)
        }

        const userData = await userRequest.json()

        if (userData.public_repos) {
            const reposRequest = await fetch(`${githubAPIURL}/users/${username}/repos`)
            const reposData = await reposRequest.json()
            userData.repos = reposData
        }

        showUserData(userData)
        hideError()
    } catch (error) {
        showError(error.message)
    }
}

// Add info to HTML
const h1 = document.querySelector("h1")
const article = document.querySelector("article")
const description = document.getElementById("description")
const data = document.getElementById("user-data-list")
const lastRepos = document.getElementById("last-repos")
const avatar = document.getElementById("avatar")


// Fill the content
function showUserData(userData) {
    // User content
    avatar.src = userData.avatar_url
    h1.textContent = userData.name || userData.login
    description.textContent = userData.bio || "No description provided"
    const ch = data.children
    ch[0].textContent = `${userData.followers} followers`
    ch[1].textContent = `${userData.following} following`
    ch[2].textContent = `${userData.public_repos} repos`


    // Repos content
    let showRepos = false
    const newChilds = []
    if (userData.public_repos) {
        userData.repos.splice(0,6).forEach(repo => {
            // Create link
            const link = document.createElement("a")

            // Fill info to link
            link.textContent = repo.name
            link.href = repo.html_url
            link.target = "blank"
            

            // Append to the newChilds array
            newChilds.push(link)
        });
        lastRepos.replaceChildren(...newChilds)
        showRepos = true
    }


    // Make the article visible
    if (getComputedStyle(article).visibility == "hidden") {
        article.style.height = "100%"
        article.style.visibility = "visible"
    }

    //Make repos visible
    showRepos ? (
        lastRepos.style.height = "100%",
        lastRepos.style.visibility = "visible"
    ):(
        lastRepos.style.height = "0",
        lastRepos.style.visibility = "hidden"
    )
}

// Errors
function showError(error) {
    const errorContent = document.createElement("h1")
    errorContent.textContent = `Error ❌ ${error}`

    searchBar.replaceChildren(searchBar.firstElementChild, errorContent)

    // Hide article
    if (getComputedStyle(article).visibility == "visible") {
        article.style.height = "0"
        article.style.visibility = "hidden"
    }

}

function hideError() {
    searchBar.replaceChildren(searchBar.firstElementChild)
}