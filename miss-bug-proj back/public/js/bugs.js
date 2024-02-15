
async function getBugs() {
    const elPre = document.querySelector('pre')

    const res = await fetch('bugs')
    const bugs = await res.json()

    elPre.innerText = JSON.stringify(bugs, null, 4)
}