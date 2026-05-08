import styles from "../../css/pageNotFound.module.css";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.description}>
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <Link to="/" className={styles.homeButton}>
          Go Back Home
        </Link>
      </div>
    </div>
  );
}