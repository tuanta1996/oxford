let currentView = "books";
let currentAudioType = "cd1";

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initBooks();
    initAudio();
    initVideo();
    switchView("books");
});

function initNavigation() {
    const navItems = document.querySelectorAll(".nav-links li");
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            navItems.forEach(n => n.classList.remove("active"));
            item.classList.add("active");
            const view = item.getAttribute("data-view");
            switchView(view);
        });
    });
}

function switchView(view) {
    document.querySelectorAll(".view-section").forEach(s => s.classList.add("hidden"));
    document.getElementById("main-audio").pause();
    document.getElementById("main-video").pause();
    document.querySelector(".disc-animation").classList.remove("playing");

    if (view === "books") {
        document.getElementById("books-view").classList.remove("hidden");
    } else if (view === "cd1" || view === "cd2") {
        document.getElementById("audio-view").classList.remove("hidden");
        document.getElementById("audio-title").textContent = view === "cd1" ? "Audio CD 1" : "Audio CD 2";
        loadAudioList(view);
    } else if (view === "videos") {
        document.getElementById("videos-view").classList.remove("hidden");
        loadVideoList();
    }
}

function initBooks() {
    const bookBtns = document.querySelectorAll(".book-selector .btn");
    const pdfViewer = document.getElementById("pdf-viewer");
    bookBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            bookBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const pdfFile = btn.getAttribute("data-pdf");
            pdfViewer.src = pdfFile;
        });
    });
}

function initAudio() {
    const audioEl = document.getElementById("main-audio");
    const discAnim = document.querySelector(".disc-animation");
    audioEl.onpause = () => discAnim.classList.remove("playing");
    audioEl.onplay = () => discAnim.classList.add("playing");
    audioEl.onended = () => {
        discAnim.classList.remove("playing");
        const currentActive = document.querySelector("#track-list li.playing");
        if(currentActive && currentActive.nextElementSibling) {
            currentActive.nextElementSibling.click();
        }
    };
}

function initVideo() {
    // any initialization for video
}

function loadAudioList(cdType) {
    const trackList = document.getElementById("track-list");
    trackList.innerHTML = "";
    const tracks = mediaData[cdType] || [];
    
    const audioEl = document.getElementById("main-audio");
    const trackNameEl = document.getElementById("current-track-name");
    
    const baseFolder = cdType === "cd1" 
        ? "Oxford_Phonics_World_1_SB_CD1/Oxford Phonics World_1_SB_CD1" 
        : "Oxford_Phonics_World_1_SB_CD2/Oxford Phonics World_1_SB_CD2";
    const encodedFolder = encodeURI(baseFolder);

    tracks.forEach((track) => {
        const li = document.createElement("li");
        li.textContent = "🎵 " + track;
        li.addEventListener("click", () => {
            document.querySelectorAll("#track-list li").forEach(el => el.classList.remove("playing"));
            li.classList.add("playing");
            audioEl.src = encodedFolder + "/" + encodeURIComponent(track);
            trackNameEl.textContent = track;
            audioEl.play();
        });
        trackList.appendChild(li);
    });
}

function loadVideoList() {
    const videoList = document.getElementById("video-list");
    if(videoList.children.length > 0) return;
    videoList.innerHTML = "";
    const videos = mediaData.videos || [];
    
    const videoEl = document.getElementById("main-video");
    const encodedFolder = encodeURI("Oxford_Phonics_World_1_Video/Oxford Phonics World_1_Video");

    videos.forEach((vid) => {
        const li = document.createElement("li");
        li.textContent = "🎬 " + vid;
        li.addEventListener("click", () => {
            document.querySelectorAll("#video-list li").forEach(el => el.classList.remove("playing"));
            li.classList.add("playing");
            videoEl.src = encodedFolder + "/" + encodeURIComponent(vid);
            videoEl.play();
        });
        videoList.appendChild(li);
    });
}
