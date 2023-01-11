import pc from "picocolors";

export const logger = (function () {
  let problemsArray = [];

  return {
    addWarning(text) {
      problemsArray.push({ text, type: "warning" });
    },
    addError(text) {
      problemsArray.push({ text, type: "error" });
    },
    printAll() {
      problemsArray.forEach((problem) => {
        switch (problem.type) {
          case "warning":
            console.log(pc.yellow("WARN: ") + problem.text);
        }
      });
    },
  };
})();
