import { useEffect, useState } from "react";

export default function App() {
  const [workbooks, setWorkbooks] = useState([]);

  useEffect(() => {
    fetch("./workbooks.json")
      .then((r) => r.json())
      .then(setWorkbooks);
  }, []);

  return (
    <main>
      <h1>Table of Contents for Digital Resources</h1>

      {workbooks.map((wb) => (
        <section key={wb.href}>
          <h2>
            <a href={wb.href}>{wb.title}</a>
          </h2>
          <ul>
            {wb.chapters.map((ch) => (
              <li key={ch.id}>
                <a href={`${wb.href}#${ch.id}`}>
                  {ch.chap_num}: {ch.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}