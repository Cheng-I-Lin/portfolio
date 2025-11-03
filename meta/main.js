import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

async function loadData() {
  const data = await d3.csv("loc.csv", (row) => ({
    ...row,
    line: Number(row.line), // or just +row.line
    depth: Number(row.depth),
    length: Number(row.length),
    date: new Date(row.date + "T00:00" + row.timezone),
    datetime: new Date(row.datetime),
  }));

  return data;
}

function processCommits(data) {
  return d3
    .groups(data, (d) => d.commit)
    .map(([commit, lines]) => {
      let first = lines[0];
      let { author, date, time, timezone, datetime } = first;
      let ret = {
        id: commit,
        url: "https://github.com/Cheng-I-Lin/portfolio/commit/" + commit,
        author,
        date,
        time,
        timezone,
        datetime,
        hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
        totalLines: lines.length,
      };

      Object.defineProperty(ret, "lines", {
        value: lines,
        // What other options do we need to set?
        // Hint: look up configurable, writable, and enumerable
        writable: true, // Allows modification of the array itself (e.g., push, pop)
        enumerable: false, // Makes the property non-enumerable (hidden from enumeration)
        configurable: true, // Allows the property to be deleted or its attributes changed
      });

      return ret;
    });
}

function renderCommitInfo(data, commits) {
  // Create the dl element
  const dl = d3.select("#stats").append("dl").attr("class", "stats");

  // Add total commits
  dl.append("dt").text("COMMITS");
  dl.append("dd").text(commits.length);

  // Add total files
  dl.append("dt").html('FILES');
  dl.append("dd").text(d3.group(data, d => d.file).size);

  // Add total LOC
  dl.append("dt").html('TOTAL <abbr title="Lines of code">LOC</abbr>');
  dl.append("dd").text(data.length);

  // Add max depth
  dl.append("dt").html('MAX DEPTH');
  dl.append("dd").text(d3.max(data, d => d.depth));

  // Add max line
  const fileLengths = d3.rollups(
    data,
    (v) => d3.max(v, (v) => v.line),
    (d) => d.file,
  );
  dl.append("dt").html('AVG LINES');
  dl.append("dd").text(d3.mean(fileLengths, (d) => d[1]));

  // Add longest line
  dl.append("dt").html('MAX LINES');
  dl.append("dd").text(d3.max(data, d => d.line));
}

let data = await loadData();
let commits = processCommits(data);

renderCommitInfo(data, commits);
