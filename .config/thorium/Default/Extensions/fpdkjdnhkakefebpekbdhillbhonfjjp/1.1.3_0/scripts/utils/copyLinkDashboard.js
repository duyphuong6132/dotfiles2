var referfriendLink;
chrome.storage.local.get("referralCode", async (result) => {
  if (
    result == undefined ||
    result == null ||
    result.referralCode == undefined ||
    result.referralCode == ""
  ) {
    alert("Login first!! referralCode not found");
  } else {
    console.log(result.referralCode);

    referfriendLink =
      "https://www.dawninternet.com/register/?referralCode=" +
      result.referralCode;
  }
});
