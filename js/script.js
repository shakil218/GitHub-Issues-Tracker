// Get and display all issues card data
const getAllIssuesCard = async (searchText = "") => {
  // get each element by id
  const totalIssuesCount = document.getElementById("total-issues");
  const container = document.getElementById("issues-container");
  const spinner = document.getElementById("loading-spinner");

  try {
    // Show spinner immediately
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

    // Set total issues count dynamically
    totalIssuesCount.textContent = allIssuesCards.length;

    // Hide spinner once data is ready
    spinner.classList.remove("spinner");
    spinner.classList.add("hidden");

    // Clear old content
    container.innerHTML = "";

    // Render issues dynamically
    allIssuesCards.forEach((issueCard) => {
      // create dynamic issue card
      const card = document.createElement("div");

      // set issue card class
      card.className =
        "max-w-md bg-white/10 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-white/20";

      // convert date to toLocalDateString()
      const createdDate = new Date(issueCard.createdAt).toLocaleDateString();
      const updatedDate = new Date(issueCard.updatedAt).toLocaleDateString();

      // set issueCard innerHTML
      card.innerHTML = `
        <!-- Top Purple Border -->
              <div class="h-1 ${
                issueCard.status.toLowerCase() === "open"
                  ? "bg-green-500"
                  : "bg-purple-500"
              } "></div>

              <div class="p-6">
                <!-- Top Row -->
                <div class="flex items-center justify-between mb-4">
                  <!-- Icon -->
                  <div
                    class="w-12 h-12 flex items-center justify-center rounded-full ${
                      issueCard.status.toLowerCase() === "open"
                        ? "bg-green-400/20"
                        : "bg-purple-400/40"
                    }"
                  >
                    ${
                      issueCard.status.toLowerCase() === "open"
                        ? `<img
                      src="./assets/Open-Status.png"
                      alt="Opened"
                      class="text-green-300 text-lg"
                    />`
                        : `<img
                      src="./assets/Closed- Status .png"
                      alt="Closed"
                      class="text-purple-300 text-lg"
                    />`
                    }
                  </div>

                  <!-- Priority Badge -->
                  <span
                    class="px-6 py-2 rounded-full text-sm font-semibold
                    ${
                      issueCard.priority.toLowerCase() === "high"
                        ? "bg-red-200 text-red-400 border-red-400/40 badge"
                        : issueCard.priority.toLowerCase() === "medium"
                          ? "bg-yellow-100 text-yellow-600 border-yellow-400/40 badge"
                          : issueCard.priority.toLowerCase() === "low"
                            ? "bg-white/20 text-white/80 border-white/40 badge"
                            : ""
                    }"
                  >
                    ${issueCard.priority}
                  </span>
                </div>

                <!-- Title -->
                <h2 class="text-xl font-semibold text-white mb-3 leading-snug">
                  ${issueCard.title}
                </h2>

                <!-- Description -->
                <p class="text-white/70 mb-5 line-clamp-2 hover:line-clamp-none transition-all duration-300" title=${issueCard.description}>
                  ${issueCard.description}
                </p>

                <!-- Labels -->
                <div class="flex flex-wrap gap-3 mb-5">
                  ${dynamicLabels(issueCard.labels)}
                </div>
              </div>

              <!-- Divider -->
              <div class="border-t border-white/20"></div>

              <!-- Footer -->
              <div class="flex justify-between items-center gap-4 p-6 text-white/70 text-sm">
                <div class="space-y-1">
                  <p>#<span> ${issueCard.id}</span> by <span>${issueCard.author}</span></p>
                  <p>Assignee: ${issueCard.assignee ? issueCard.assignee : "Unassigned"}</p>
                </div>
                <div class="space-y-1">
                  <p>${createdDate}</p>
                  <p>Updated: ${updatedDate}</p>
                </div>
              </div>
      `;

      // Attach click to open modal
      card.addEventListener("click", () => {
        getSingleIssue(issueCard.id);
      });

      container.appendChild(card);
    });

    return data;
  } catch (error) {
    // Hide spinner on error
    spinner.classList.add("hidden");
    container.innerHTML = `<p class="text-red-500">Failed to load issues.</p>`;
  }
};

// create dynamic labels
const dynamicLabels = (labels) => {
  console.log(labels);
  const labelsHTML = labels
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
  return labelsHTML;
};

// Get a single issue data using id
const getSingleIssue = async (id) => {
  try {
    const response = await fetch(
      `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch single card data");
    }

    const data = await response.json();
    const issueCard = data.data;

    displayIssueModal(issueCard);
  } catch (error) {
    console.error("Error fetching issue:", error);
  }
};

//display issue card information inside the modal
const displayIssueModal = (issueCard) => {
  // get modal container by id
  const modal = document.getElementById("my_modal_5");

  try {
    // Clear old modal content
    modal.innerHTML = "";

    // Convert date
    const localDate = new Date(issueCard.updatedAt).toLocaleDateString();

    // Create dialog element
    const div = document.createElement("div");

    div.className = "modal-box max-w-xl p-0 overflow-hidden";
    div.innerHTML = `
              <!-- Modal Card -->
              <div
                class="w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
              >
                <div class="p-6">
                  <!-- Title -->
                  <h2
                    class="text-2xl font-bold text-gray-900 dark:text-white mb-3"
                  >
                    ${issueCard.title}
                  </h2>

                  <!-- Status Row -->
                  <div class="flex flex-wrap items-center gap-3 text-sm mb-4">
                    <span
                      class="px-3 py-1 ${issueCard.status.toLowerCase() === "open" ? "bg-green-400" : "bg-purple-400"} text-white rounded-full text-xs"
                    >
                      ${issueCard.status}
                    </span>
                    <span class="text-gray-600 dark:text-gray-300">
                      • Opened by ${issueCard.author} • ${localDate}
                    </span>
                  </div>

                  <!-- Labels -->
                  <div class="flex gap-3 mb-5">
                    ${dynamicLabels(issueCard.labels)}
                  </div>

                  <!-- Description -->
                  <p class="text-gray-700 dark:text-gray-300 mb-6">
                    ${issueCard.description}
                  </p>
                </div>

                <!-- Info Section -->
                <div
                  class="px-6 py-5 flex md:max-w-md justify-between gap-4 bg-gray-50 dark:bg-gray-700"
                >
                  <div class="space-y-2">
                    <p class="text-gray-500 dark:text-gray-400 text-sm">
                      Assignee:
                    </p>
                    <p class="font-semibold text-gray-800 dark:text-white">
                      ${issueCard.assignee ? issueCard.assignee : "Unassigned"}
                    </p>
                  </div>
                  <div class="space-y-2">
                    <p class="text-gray-500 dark:text-gray-400 text-sm">
                      Priority:
                    </p>
                    <span
                      class="inline-block rounded-full text-sm
                      ${
                        issueCard.priority.toLowerCase() === "high"
                          ? "bg-red-200 text-red-400 border-red-400/40 badge"
                          : issueCard.priority.toLowerCase() === "medium"
                            ? "bg-yellow-100 text-yellow-600 border-yellow-400/40 badge"
                            : issueCard.priority.toLowerCase() === "low"
                              ? "bg-gray-300 text-white border-gray-400/40 badge"
                              : ""
                      }"
                    >
                      ${issueCard.priority}
                    </span>
                  </div>
                </div>
                <!-- Modal Close Button -->
                <div class="modal-action mt-4 sm:mt-0 p-5 border-none">
                  <form method="dialog">
                    <button class="btn bg-[#010950] hover:bg-[#014d8f] text-white">Close</button>
                  </form>
                </div>
              </div>
            `;

    // Append modal to body
    modal.appendChild(div);

    // Show modal
    my_modal_5.showModal();
  } catch {}
};

// 2️⃣ Search input
const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", () => {
  const searchText = searchInput.value.trim();

  getAllIssuesCard(searchText);
});

// Directly call the function
getAllIssuesCard();
