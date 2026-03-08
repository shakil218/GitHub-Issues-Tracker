// ***Global state***
let currentStatus = "all";
let currentSearchText = "";

// ***Get and display all issues card data***
const getAllIssuesCard = async (status = "all", searchText = "") => {
  const totalIssuesCardsCount = document.getElementById("total-issues");
  const container = document.getElementById("issues-container");
  const spinner = document.getElementById("loading-spinner");

  try {
    // Show spinner
    spinner.classList.remove("hidden");
    spinner.classList.add("spinner");

    // Decide API URL
    const url = searchText
      ? `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`
      : `https://phi-lab-server.vercel.app/api/v1/lab/issues`;

    // Fetch data
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    const allIssuesCards = data.data;

    // Filter by status
    let filteredIssuesCards = allIssuesCards;
    if (status !== "all") {
      filteredIssuesCards = filteredIssuesCards.filter(
        (issueCard) => issueCard.status.toLowerCase() === status,
      );
    }

    // Update total issues count
    totalIssuesCardsCount.textContent = filteredIssuesCards.length;

    // Hide spinner
    spinner.classList.remove("spinner");
    spinner.classList.add("hidden");

    // Clear container
    container.innerHTML = "";

    // Render issues
    filteredIssuesCards.forEach((issueCard) => {
      const card = document.createElement("div");
      card.className = `group max-w-md bg-white/20 backdrop-blur-xl rounded-xl border border-white/20
                  shadow-lg transition-all duration-300
                  hover:scale-105 hover:-translate-y-2
                  hover:shadow-[0_20px_50px_rgba(168,85,247,0.35)]`;

      const createdDate = new Date(issueCard.createdAt).toLocaleDateString();
      const updatedDate = new Date(issueCard.updatedAt).toLocaleDateString();

      card.innerHTML = `
        <div class="h-2 rounded-t-xl ${
          issueCard.status.toLowerCase() === "open"
            ? "bg-green-500"
            : "bg-purple-500"
        }"></div>

        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 flex items-center justify-center rounded-full 
                        transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 ${
                          issueCard.status.toLowerCase() === "open"
                            ? "bg-green-400/20"
                            : "bg-purple-400/40"
                        }">
              ${
                issueCard.status.toLowerCase() === "open"
                  ? `<img src="./assets/Open-Status.png" alt="Opened"/>`
                  : `<img src="./assets/Closed- Status .png" alt="Closed"/>`
              }
            </div>
            <span class="px-6 py-2 rounded-full text-sm font-semibold ${
              issueCard.priority.toLowerCase() === "high"
                ? "bg-red-200 text-red-400 border-red-400/40 badge"
                : issueCard.priority.toLowerCase() === "medium"
                  ? "bg-yellow-100 text-yellow-600 border-yellow-400/40 badge"
                  : issueCard.priority.toLowerCase() === "low"
                    ? "bg-white/20 text-white/80 border-white/40 badge"
                    : ""
            }">
              ${issueCard.priority}
            </span>
          </div>

          <h2 class="text-xl font-semibold text-white mb-3 leading-snug">
            ${issueCard.title}
          </h2>

          <p class="text-white/70 mb-5 line-clamp-2 hover:line-clamp-none transition-all duration-300" title="${issueCard.description}">
            ${issueCard.description}
          </p>

          <div class="flex flex-wrap gap-3 mb-5">
            ${dynamicLabels(issueCard.labels)}
          </div>
        </div>

        <div class="border-t border-white/20"></div>

        <div class="flex justify-between items-center gap-4 p-6 text-white/70 text-sm">
          <div class="space-y-1">
            <p>#${issueCard.id} by ${issueCard.author}</p>
            <p>Assignee: ${issueCard.assignee ? issueCard.assignee : "Unassigned"}</p>
          </div>
          <div class="space-y-1">
            <p>${createdDate}</p>
            <p>Updated: ${updatedDate}</p>
          </div>
        </div>
      `;

      card.addEventListener("click", () => {
        getSingleIssueCard(issueCard.id);
      });

      container.appendChild(card);
    });

    return data;
  } catch (error) {
    spinner.classList.add("hidden");
    container.innerHTML = `<p class="text-red-500">Failed to load issues.</p>`;
    console.error("Error fetching issues:", error);
  }
};

// ***Dynamic labels***
const dynamicLabels = (labels) => {
  return labels
    ?.map(
      (label) => `
      <span
        class="flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-semibold
        ${
          label.toLowerCase() === "bug"
            ? "bg-red-200 text-red-400 border-red-400/40 badge"
            : label.toLowerCase() === "help wanted"
              ? "bg-yellow-100 text-yellow-600 border-yellow-400/40 badge"
              : label.toLowerCase() === "enhancement"
                ? "bg-green-100 text-green-600 border-green-400/40 badge"
                : label.toLowerCase() === "good first issue"
                  ? "bg-fuchsia-100 text-fuchsia-600 border-fuchsia-400/40 badge"
                  : label.toLowerCase() === "documentation"
                    ? "bg-cyan-100 text-cyan-600 border-cyan-400/40 badge"
                    : "bg-gray-200 text-gray-600 border-gray-400/40"
        }"
      >
        ${
          label.toLowerCase() === "bug"
            ? `<i class="fa-solid fa-bug"></i>`
            : label.toLowerCase() === "help wanted"
              ? `<i class="fa-regular fa-life-ring"></i>`
              : label.toLowerCase() === "enhancement"
                ? `<i class="fa-solid fa-wand-magic-sparkles"></i>`
                : label.toLowerCase() === "good first issue"
                  ? `<i class="fa-solid fa-seedling"></i>`
                  : label.toLowerCase() === "documentation"
                    ? `<i class="fa-solid fa-file-lines"></i>`
                    : ""
        }
        ${label.toUpperCase()}
      </span>
    `,
    )
    .join("");
};

// ***Get single issue & show modal***
const getSingleIssueCard = async (id) => {
  try {
    const response = await fetch(
      `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`,
    );
    if (!response.ok) throw new Error("Failed to fetch single issue");

    const data = await response.json();
    displayIssueCardDetailsWithModal(data.data);
  } catch (error) {
    console.error("Error fetching single issue:", error);
  }
};

// ***Display the issue card details with modal***
const displayIssueCardDetailsWithModal = (issueCard) => {
  const modal = document.getElementById("my_modal_5");
  modal.innerHTML = "";

  const localDate = new Date(issueCard.updatedAt).toLocaleDateString();

  const div = document.createElement("div");
  div.className = "modal-box max-w-xl p-0 overflow-hidden";
  div.innerHTML = `
    <div class="w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
      <div class="p-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">${issueCard.title}</h2>
        <div class="flex flex-wrap items-center gap-3 text-sm mb-4">
          <span class="px-3 py-1 ${
            issueCard.status.toLowerCase() === "open"
              ? "bg-green-400"
              : "bg-purple-400"
          } text-white rounded-full text-xs">
            ${issueCard.status}
          </span>
          <span class="text-gray-600 dark:text-gray-300">
            • Opened by ${issueCard.author} • ${localDate}
          </span>
        </div>
        <div class="flex gap-3 mb-5">${dynamicLabels(issueCard.labels)}</div>
        <p class="text-gray-700 dark:text-gray-300 mb-6">${issueCard.description}</p>
      </div>
      <div class="px-6 py-5 flex md:max-w-md justify-between gap-4 bg-gray-50 dark:bg-gray-700">
        <div class="space-y-2">
          <p class="text-gray-500 dark:text-gray-400 text-sm">Assignee:</p>
          <p class="font-semibold text-gray-800 dark:text-white">${issueCard.assignee ? issueCard.assignee : "Unassigned"}</p>
        </div>
        <div class="space-y-2">
          <p class="text-gray-500 dark:text-gray-400 text-sm">Priority:</p>
          <span class="inline-block rounded-full text-sm ${
            issueCard.priority.toLowerCase() === "high"
              ? "bg-red-200 text-red-400 border-red-400/40 badge"
              : issueCard.priority.toLowerCase() === "medium"
                ? "bg-yellow-100 text-yellow-600 border-yellow-400/40 badge"
                : issueCard.priority.toLowerCase() === "low"
                  ? "bg-gray-300 text-white border-gray-400/40 badge"
                  : ""
          }">${issueCard.priority}</span>
        </div>
      </div>
      <div class="modal-action mt-4 sm:mt-0 p-5 border-none">
        <form method="dialog">
          <button class="btn bg-[#010950] hover:bg-[#014d8f] text-white">Close</button>
        </form>
      </div>
    </div>
  `;

  modal.appendChild(div);
  my_modal_5.showModal();
};

// ***Search input listener***
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", () => {
  currentSearchText = searchInput.value.trim();
  getAllIssuesCard(currentStatus, currentSearchText);
});

// ***Tab click listeners***
const tabAll = document.getElementById("tab-allBtn");
const tabOpen = document.getElementById("tab-openBtn");
const tabClosed = document.getElementById("tab-closedBtn");

const tabs = [tabAll, tabOpen, tabClosed];

const setActiveTab = (activeTab) => {
  tabs.forEach((tab) => tab.classList.remove("tab-active"));
  activeTab.classList.add("tab-active");
};

tabAll.addEventListener("click", () => {
  currentStatus = "all";
  setActiveTab(tabAll);
  getAllIssuesCard(currentStatus, currentSearchText);
});

tabOpen.addEventListener("click", () => {
  currentStatus = "open";
  setActiveTab(tabOpen);
  getAllIssuesCard(currentStatus, currentSearchText);
});

tabClosed.addEventListener("click", () => {
  currentStatus = "closed";
  setActiveTab(tabClosed);
  getAllIssuesCard(currentStatus, currentSearchText);
});

// ***dynamic footer year***
document.getElementById("year").textContent = new Date().getFullYear();

// ***Initial load***
getAllIssuesCard(currentStatus, currentSearchText);
