const getAllIssues = async () => {
  const totalIssuesCount = document.getElementById("total-issues");
  const container = document.getElementById("issues-container");
  const spinner = document.getElementById("loading-spinner");

  try {
    // Show spinner immediately
    spinner.classList.remove("hidden");
    spinner.classList.add("spinner");

    // Fetch data
    const response = await fetch(
      "https://phi-lab-server.vercel.app/api/v1/lab/issues",
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    const allIssues = data.data;

    // Set total issues count dynamically
    totalIssuesCount.textContent = allIssues.length;

    // Hide spinner once data is ready
    spinner.classList.remove("spinner");
    spinner.classList.add("hidden");

    // Clear old content
    container.innerHTML = "";

    // Render issues dynamically
    allIssues.forEach((issue) => {
      console.log(issue);
      // create dynamic issue card
      const card = document.createElement("div");

      // create dynamic labels
      const labelsHTML = issue.labels
        ?.map(
          (label) => `
                  <span
                    class="flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-semibold
                    ${
                      label.toLowerCase() === "bug"
                        ? "bg-red-200 text-red-400 border-red-400/40"
                        : label.toLowerCase() === "help wanted"
                          ? "bg-yellow-100 text-yellow-600 border-yellow-400/40"
                          : "bg-gray-200 text-gray-600 border-gray-400/40"
                    }"
                  >
                    ${
                      label.toLowerCase() === "bug"
                        ? `<i class="fa-solid fa-bug"></i>`
                        : label.toLowerCase() === "help wanted"
                          ? `<i class="fa-regular fa-life-ring"></i>`
                          : ""
                    }
                    ${label.toUpperCase()}
                  </span>
                `,
        )
        .join("");

      // set issue card class
      card.className =
        "max-w-md bg-white/10 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-white/20";

      // convert date to toLocalDateString()
      const localDate = new Date(issue.updatedAt).toLocaleDateString();

      // set issue card innerHTML
      card.innerHTML = `
        <!-- Top Purple Border -->
              <div class="h-1 bg-purple-500"></div>

              <div class="p-6">
                <!-- Top Row -->
                <div class="flex items-center justify-between mb-4">
                  <!-- Icon -->
                  <div
                    class="w-12 h-12 flex items-center justify-center rounded-full bg-purple-400/40"
                  >
                    <!-- <i
                       class="fa-solid fa-circle-check text-purple-300 text-lg"
                     ></i> -->
                    <img
                      src="./assets/Closed- Status .png"
                      alt="Closed"
                      class="text-purple-300 text-lg"
                    />
                  </div>

                  <!-- Priority Badge -->
                  <span
                    class="px-6 py-2 bg-white/20 text-white/80 rounded-full text-sm font-semibold"
                  >
                    ${issue.priority}
                  </span>
                </div>

                <!-- Title -->
                <h2 class="text-xl font-semibold text-white mb-3 leading-snug">
                  ${issue.title}
                </h2>

                <!-- Description -->
                <p class="text-white/70 mb-5 line-clamp-2 hover:line-clamp-none transition-all duration-300" title=${issue.description}>
                  ${issue.description}
                </p>

                <!-- Labels -->
                <div class="flex flex-wrap gap-3 mb-5">
                  ${labelsHTML}
                </div>
              </div>

              <!-- Divider -->
              <div class="border-t border-white/20"></div>

              <!-- Footer -->
              <div class="p-6 text-white/70 space-y-1">
                <p>#<span>${issue.id}</span> by <span>${issue.author}</span></p>
                <p>${localDate}</p>
              </div>
      `;

      // Attach click to open modal
      card.addEventListener("click", () => {
        my_modal_5.showModal();
      });

      container.appendChild(card);
    });

    return data;
  } catch (error) {
    // Hide spinner on error too
    spinner.classList.add("hidden");
    console.error("Error fetching issues:", error);
    container.innerHTML = `<p class="text-red-500">Failed to load issues.</p>`;
  }
};

// Directly call the function
getAllIssues();
