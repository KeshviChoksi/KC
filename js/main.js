function MainModule(listingsID = "#listings") {
  const me = {};

  const listingsElement = document.querySelector(listingsID);

  function getListingCode(listing) {
    // Clean description (strip HTML tags)
    const cleanDesc = (listing.description || "No description available.")
      .replace(/<[^>]*>/g, "")
      .slice(0, 150) + "...";

    // Parse amenities
    let amenities = [];
    try {
      amenities = JSON.parse(listing.amenities).slice(0, 5);
    } catch {
      amenities = [];
    }

    // Superhost badge (creative addition)
    const superhostBadge =
      listing.host_is_superhost === "t"
        ? `<span class="badge bg-warning text-dark mb-2"> Superhost</span>`
        : "";

    // Rating
    const rating = listing.review_scores_rating
      ? `★ ${parseFloat(listing.review_scores_rating).toFixed(2)}`
      : "No rating yet";

    return `
    <div class="col-12 col-md-6 col-lg-4 mb-4">
      <div class="listing card h-100 shadow-sm">
        <img
          src="${listing.picture_url || "https://via.placeholder.com/400x200"}"
          class="card-img-top listing-img"
          alt="${listing.name}"
          onerror="this.src='https://via.placeholder.com/400x200'"
        />
        <div class="card-body d-flex flex-column">
          ${superhostBadge}
          <h5 class="card-title listing-title">${listing.name || "Unnamed Listing"}</h5>
          <p class="card-text text-muted small">${cleanDesc}</p>

          <div class="mb-2">
            ${amenities.map((a) => `<span class="badge bg-light text-dark border me-1">${a}</span>`).join("")}
          </div>

          <div class="d-flex align-items-center my-2">
            <img
              src="${listing.host_thumbnail_url || "https://via.placeholder.com/40"}"
              alt="${listing.host_name}"
              class="rounded-circle me-2"
              style="width:36px; height:36px; object-fit:cover;"
              onerror="this.src='https://via.placeholder.com/40'"
            />
            <span class="small text-muted">Hosted by <strong>${listing.host_name || "Unknown"}</strong></span>
          </div>

          <div class="mt-auto d-flex justify-content-between align-items-center">
            <span class="fw-bold text-success">${listing.price || "N/A"} <span class="text-muted fw-normal small">/ night</span></span>
            <span class="small text-warning">${rating}</span>
          </div>

          <a href="${listing.listing_url}" target="_blank" class="btn btn-outline-danger btn-sm mt-3">
            View on Airbnb
          </a>
        </div>
      </div>
    </div>`;
  }

  function redraw(listings) {
    listingsElement.innerHTML = "";
    listingsElement.innerHTML = listings.map(getListingCode).join("\n");
  }

  async function loadData() {
    const res = await fetch("./airbnb_sf_listings_500.json");
    const listings = await res.json();
    me.redraw(listings.slice(0, 50));
  }

  me.redraw = redraw;
  me.loadData = loadData;

  return me;
}

const main = MainModule();
main.loadData();