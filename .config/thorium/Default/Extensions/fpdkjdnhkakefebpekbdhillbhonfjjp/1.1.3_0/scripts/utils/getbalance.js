let getBalanceInterval;
let getNetworkTestInterval;
let lastUpdatedTime;
let appid;
let isInternet = false;
let networkquality;
let lastupdatedatetime;
chrome.storage.local.get(["appid"], function (result) {
  if (
    result.appid !== undefined &&
    result.appid !== null &&
    result.appid !== ""
  ) {
    appid = result.appid;
  }
});

// Usage example
const publicKey = "0x6784f65225f7d567Cf1535525b0DD720B1450D1B"; // Replace with actual public key
const keyType = "ethereum";
document.addEventListener("DOMContentLoaded", () => {
  networkquality = document.getElementById("netwokquality_");
  lastupdatedatetime = document.getElementById("lastupdatedatetime");
  const h5SendPacket = document.getElementById("h5SendPacket");

  checkPing();

  const dawnbalance = document.getElementById("dawnbalance");

  chrome.storage.local.get("token", async (result) => {
    if (
      result == undefined ||
      result == null ||
      result.token == undefined ||
      result.token == ""
    ) {
      alert("Login first!!");
      window.location.href = "signin.html";
    } else {
      let token = atob(result.token);
      try {
        const response = await fetch(
          `https://www.aeropres.in/api/atom/v1/userreferral/getpoint?appid=${appid}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Berear " + token,
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          let points = Number(data.data?.rewardPoint?.points);
          let registerpoints = Number(data.data?.rewardPoint?.registerpoints);
          let signinpoints = Number(data.data?.rewardPoint?.signinpoints);
          let commission = Number(
            data.data?.referralPoint == null
              ? 0
              : data.data?.referralPoint.commission
          );
          let twitter_x_id_points = Number(
            data.data?.rewardPoint?.twitter_x_id_points
          );
          if (twitter_x_id_points > 0) {
            chrome.storage.local.set(
              { twitter_x_id_points: twitter_x_id_points },
              () => {}
            );
          }
          let discordid_points = Number(
            data.data?.rewardPoint?.discordid_points
          );
          if (discordid_points > 0) {
            chrome.storage.local.set(
              { discordid_points: discordid_points },
              () => {}
            );
          }
          let telegramid_points = Number(
            data.data?.rewardPoint?.telegramid_points
          );
          if (telegramid_points > 0) {
            chrome.storage.local.set(
              { telegramid_points: telegramid_points },
              () => {}
            );
          }
          chrome.storage.local.set(
            {
              total_points:
                points +
                registerpoints +
                signinpoints +
                commission +
                twitter_x_id_points +
                discordid_points +
                telegramid_points,
            },
            () => {}
          );

          chrome.storage.local.set(
            {
              refrral_points: commission,
            },
            () => {}
          );

          dawnbalance.textContent =
            (
              points +
              registerpoints +
              signinpoints +
              commission +
              twitter_x_id_points +
              discordid_points +
              telegramid_points
            ).toLocaleString("en", { useGrouping: true }) +
            " " +
            "pts";

          let time1 = data.data?.referralPoint?.updatedAt;
          let time2 = data.data?.rewardPoint?.updatedAt;
          if (new Date(time1) > new Date(time2)) {
            lastUpdatedTime = time1;
          } else {
            lastUpdatedTime = time2;
          }
          chrome.storage.local.set(
            {
              lastUpdatedTime: lastUpdatedTime,
            },
            () => {}
          );

          lastupdatedatetime.textContent = formatDate(lastUpdatedTime);
        } else {
          throw new Error(data.message || "An error occurred");
        }
      } catch (error) {
        if (error.message != undefined && !error.message.includes("fetch")) {
          if (isInternet) {
            alert(error.message);

            let m = error.message;
            let word = "TokenExpiredError";
            let word2 = "session";
            if (m.includes(word) || m.includes(word2)) {
              window.location.href = "signin.html";
            }
          } else {
            alert("Not Internet connection!!");
            document.getElementById("connectedMsg").style.display = "none";
          }
        } else {
        }
      }
    }
  });

  getBalanceInterval = setInterval(() => getLatestBalance(), 300000);
  function getLatestBalance() {
    if (isInternet) {
      chrome.storage.local.get("token", async (result) => {
        if (
          result == undefined ||
          result == null ||
          result.token == undefined ||
          result.token == ""
        ) {
          alert("Login first!!");
          window.location.href = "signin.html";
        } else {
          let token = atob(result.token);

          try {
            const response = await fetchWithRetry(
              `https://www.aeropres.in/api/atom/v1/userreferral/getpoint?appid=${appid}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Berear " + token,
                },
              }
            );

            const data = await response.json();
            if (response.ok) {
              console.log("dashboard updating...");

              let points = Number(data.data?.rewardPoint?.points);
              let registerpoints = Number(
                data.data?.rewardPoint?.registerpoints
              );
              let signinpoints = Number(data.data?.rewardPoint?.signinpoints);
              let commission = Number(
                data.data?.referralPoint == null
                  ? 0
                  : data.data?.referralPoint.commission
              );

              let twitter_x_id_points = Number(
                data.data?.rewardPoint?.twitter_x_id_points
              );
              if (twitter_x_id_points > 0) {
                chrome.storage.local.set(
                  { twitter_x_id_points: twitter_x_id_points },
                  () => {}
                );
              }
              let discordid_points = Number(
                data.data?.rewardPoint?.discordid_points
              );
              if (discordid_points > 0) {
                chrome.storage.local.set(
                  { discordid_points: discordid_points },
                  () => {}
                );
              }
              let telegramid_points = Number(
                data.data?.rewardPoint?.telegramid_points
              );
              if (telegramid_points > 0) {
                chrome.storage.local.set(
                  { telegramid_points: telegramid_points },
                  () => {}
                );
              }

              dawnbalance.textContent =
                (
                  points +
                  registerpoints +
                  signinpoints +
                  commission +
                  twitter_x_id_points +
                  discordid_points +
                  telegramid_points
                ).toLocaleString("en", { useGrouping: true }) +
                " " +
                "pts";

              let time1 = data.data?.referralPoint?.updatedAt;
              let time2 = data.data?.rewardPoint?.updatedAt;
              if (new Date(time1) > new Date(time2)) {
                lastUpdatedTime = time1;
              } else {
                lastUpdatedTime = time2;
              }
              lastupdatedatetime.textContent = formatDate(lastUpdatedTime);
              console.log("dashboard updated.");
            } else {
              throw new Error(data.message || "An error occurred");
            }
          } catch (error) {
            if (
              error.message != undefined &&
              !error.message.includes("fetch")
            ) {
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
      });
    }
  }
  document
    .getElementById("refreshpoint")
    .addEventListener("click", async function () {
      getLatestBalance();
    });
  document
    .getElementById("checkConnection")
    .addEventListener("click", async function () {
      checkPing();
      getLatestBalance();
    });
  getNetworkTestInterval = setInterval(() => networkTest(), 1000 * 60 * 15);
  function networkTest() {
    const startTime = new Date().getTime();
    fetch("https://8.8.8.8", { mode: "no-cors" })
      .then(() => {
        const endTime = new Date().getTime();
        const latency = endTime - startTime;
        console.log(`Latency: ${latency}ms`);
        isInternet = true;
        if (latency < 50) {
          console.log("Excellent connection");
          //100
          networkquality.textContent = "100";
        } else if (latency < 100) {
          console.log("Good connection");
          //90
          networkquality.textContent = "90";
        } else if (latency < 200) {
          console.log("Fair connection");
          //75
          networkquality.textContent = "75";
        } else {
          console.log("Poor connection");
          //40
          networkquality.textContent = "40";
        }
      })
      .catch((error) => {
        console.error("Ping test failed:", error);
        document.getElementById("isnetworkconnected").textContent =
          "Disconnected";
        document.getElementById("checkConnection").style.display = "block";

        const icon = document.getElementById("i_connect");
        icon.style.color = "gray";
        icon.style.fontSize = "small";
        isInternet = false;
        document.getElementById("connectedMsg").style.display = "none";
      });
  }
});
window.addEventListener("beforeunload", clearMyInterval);
function clearMyInterval() {
  clearInterval(getBalanceInterval);
  clearInterval(getNetworkTestInterval);
  console.log("Interval cleared");
}

function formatDate(dateString) {
  const date = new Date(dateString);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = date.getUTCDate();
  const month = monthNames[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Adjust hours
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  const ordinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${month} ${day}${ordinalSuffix(
    day
  )}, ${year} ${formattedHours}:${formattedMinutes} ${ampm} GMT`;
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
function checkPing() {
  if (navigator.onLine) {
    console.log("Internet is connected");
    // Perform actions for when internet is connected
    document.getElementById("isnetworkconnected").textContent = "Connected";
    document.getElementById("checkConnection").style.display = "none";
    const icon = document.getElementById("i_connect");
    icon.style.color = "green";
    icon.style.fontSize = "small";
    isInternet = true;
    document.getElementById("connectedMsg").style.display = "block";
  } else {
    console.log("Internet is not connected");
    // Perform actions for when internet is not connected
    document.getElementById("isnetworkconnected").textContent = "Disconnected";
    document.getElementById("checkConnection").style.display = "block";

    const icon = document.getElementById("i_connect");
    const text = document.getElementById("isnetworkconnected");
    icon.style.color = "gray";
    icon.style.fontSize = "small";
    isInternet = false;
    text.style.color = "gray";
    document.getElementById("connectedMsg").style.display = "none";
  }
  const startTime = new Date().getTime();
  fetch("https://8.8.8.8", { mode: "no-cors" })
    .then(() => {
      const endTime = new Date().getTime();
      const latency = endTime - startTime;
      console.log(`Latency: ${latency}ms`);
      isInternet = true;
      if (latency < 50) {
        console.log("Excellent connection");
        //100
        networkquality.textContent = "100";
      } else if (latency < 100) {
        console.log("Good connection");
        //90
        networkquality.textContent = "90";
      } else if (latency < 200) {
        console.log("Fair connection");
        //75
        networkquality.textContent = "75";
      } else {
        console.log("Poor connection");
        //40
        networkquality.textContent = "40";
      }
    })
    .catch((error) => {
      console.error("Ping test failed:", error);
      document.getElementById("isnetworkconnected").textContent =
        "Disconnected";
      document.getElementById("checkConnection").style.display = "block";

      const icon = document.getElementById("i_connect");
      const text = document.getElementById("isnetworkconnected");
      text.style.color = "gray";
      icon.style.color = "gray";
      icon.style.fontSize = "small";
      isInternet = false;
      document.getElementById("connectedMsg").style.display = "none";
      checkPingFromServer();
    });
}
function checkPingFromServer() {
  const startTime = new Date().getTime();
  fetch("https://www.aeropres.in/dawnserver/ping", { mode: "no-cors" })
    .then(() => {
      const endTime = new Date().getTime();
      const latency = endTime - startTime;
      console.log(`Latency: ${latency}ms`);
      isInternet = true;
      if (latency < 50) {
        console.log("Excellent connection");
        //100
        networkquality.textContent = "100";
      } else if (latency < 100) {
        console.log("Good connection");
        //90
        networkquality.textContent = "90";
      } else if (latency < 200) {
        console.log("Fair connection");
        //75
        networkquality.textContent = "75";
      } else {
        console.log("Poor connection");
        //40
        networkquality.textContent = "40";
      }
    })
    .catch((error) => {
      console.error("Ping test failed:", error);
      document.getElementById("isnetworkconnected").textContent =
        "Disconnected";
      document.getElementById("checkConnection").style.display = "block";

      const icon = document.getElementById("i_connect");
      const text = document.getElementById("isnetworkconnected");
      text.style.color = "gray";
      icon.style.color = "gray";
      icon.style.fontSize = "small";
      isInternet = false;
      document.getElementById("connectedMsg").style.display = "none";
    });
}
