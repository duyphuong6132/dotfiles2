let token;
let lastUpdatedTime;
let isInternet = false;
let appid;
chrome.storage.local.get(["appid"], function (result) {
  if (
    result.appid !== undefined &&
    result.appid !== null &&
    result.appid !== ""
  ) {
    appid = result.appid;
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const appversion = document.getElementById("appversion");

  const version = chrome.runtime.getManifest().version;
  console.log(version);
  appversion.textContent = "v" + " " + version;
  chrome.storage.local.get("token", async (result) => {
    if (
      result == undefined ||
      result == null ||
      result.token == undefined ||
      result.token == ""
    ) {
      alert("Login first!!");
    } else {
      console.log("storage");
      token = atob(result.token);
    }
  });

  chrome.storage.local.get("firstname", async (result) => {
    if (
      result == undefined ||
      result == null ||
      result.firstname == undefined ||
      result.firstname == ""
    ) {
      alert("Login first!!");
    } else {
      console.log(result.firstname, decodeURIComponent(atob(result.firstname)));
      document.getElementById("fullname").value = decodeURIComponent(
        atob(result.firstname)
      );
    }
  });

  chrome.storage.local.get("username", async (result) => {
    if (
      result == undefined ||
      result == null ||
      result.username == undefined ||
      result.username == ""
    ) {
      alert("Login first!!");
    } else {
      document.getElementById("username").value = atob(result.username);
    }
  });

  const btnProfileUpdate = document.getElementById("btnProfileUpdate");

  btnProfileUpdate.addEventListener("click", async () => {
    const fullname = document.getElementById("fullname").value;

    let data = { fullname };
    await updateProfile(token, data);
  });
});

async function updateProfile(_token, data) {
  const btnProfileUpdate = document.getElementById("btnProfileUpdate");

  btnProfileUpdate.disabled = true;
  btnProfileUpdate.style.cursor = "not-allowed";
  const url = `https://www.aeropres.in/chromeapi/dawn/v1/profile/updatename?appid=${appid}`;
  const token = "Brearer " + _token; // Replace with your actual authorization token

  try {
    const response = await fetchWithRetry(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "An error occurred");
    }

    if (data.fullname != "") {
      chrome.storage.local.set({ firstname: data.fullname }, () => {});
    }

    chrome.storage.local.set(
      { twitter_x_id: data.twitter_x_id == undefined ? "" : data.twitter_x_id },
      () => {}
    );

    chrome.storage.local.set(
      { discordid: data.discordid == undefined ? "" : data.discordid },
      () => {}
    );

    chrome.storage.local.set(
      { telegramid: data.telegramid == undefined ? "" : data.telegramid },
      () => {}
    );

    btnProfileUpdate.disabled = false;
    btnProfileUpdate.style.cursor = "pointer";
    alert("success");
  } catch (error) {
    console.error("Error updating profile:", error);
    btnProfileUpdate.disabled = false;
    btnProfileUpdate.style.cursor = "pointer";
    if (error.message != undefined && error.message != "") {
      alert(error.message);

      let m = error.message;
      let word = "TokenExpiredError";
      let word2 = "session";
      if (m.includes(word) || m.includes(word2)) {
        window.location.href = "signin.html";
      }
    }
  }
}

async function fetchWithRetry(url, options = {}) {
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 3000; // 3 seconds

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, options);
      return response; // If successful, return the response
    } catch (error) {
      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        // This error typically indicates a network error (server down)
        if (attempt === MAX_RETRIES) {
          throw error; // If all retries failed, throw the last error
        }
        console.log(
          `Server seems to be down. Attempt ${attempt} failed. Retrying in ${
            RETRY_DELAY / 1000
          } seconds...`
        );
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      } else {
        // For other types of errors, throw immediately without retrying
        throw error;
      }
    }
  }
}
