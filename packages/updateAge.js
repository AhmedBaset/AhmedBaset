const fs = require("fs").promises
const { birthday } = require("../config")

const ageAsDate = new Date() - birthday;

(async () => {
  const { years, months, days } = calculateAge()
  
  const README = "./../README.md";
  
  const readmeContent = await fs.readFile(README)
  const newContent = readmeContent.replace(/age(\s?=|:)\s?(.+)(;|,)/, `age$1 ${years} years, ${months} months, and ${days} days$3`)
  
  await fs.writeFile(README, newContent)
  console.log("DONE")
})()

function calculateAge() {
  const today = new Date();
  const birth = new Date(birthday);

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (months < 0 || (months === 0 && days < 0)) {
    years--;
    months += 12;
  }

  if (days < 0) {
    const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 0);
    days += prevMonth.getDate();
    months--;
  }

  return { years, months, days };
}


