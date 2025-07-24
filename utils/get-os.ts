export function getOS() {
  const { userAgent, platform } = window.navigator;
  const macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];
  const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];
  const iosPlatforms = ["iPhone", "iPad", "iPod"];

  if (macosPlatforms.includes(platform)) {
    return "Mac";
  } else if (iosPlatforms.includes(platform)) {
    return "iOS";
  } else if (windowsPlatforms.includes(platform)) {
    return "Windows";
  } else if (/Android/.test(userAgent)) {
    return "Android";
  } else if (/Linux/.test(platform)) {
    return "Linux";
  }
  return "Unknown";
}
