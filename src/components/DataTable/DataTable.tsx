import styles from './DataTable.module.css';

interface DataTableProps {
  headers: string[];
  rows: (string | React.ReactNode)[][];
}

/** A scrollable reference table (headers + rows) — used for in-game UI reference data
 *  like odds tables and crafting costs. */
export default function DataTable({ headers, rows }: DataTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h} className={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={styles.tr}>
              {row.map((cell, j) => (
                <td key={j} className={styles.td}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
