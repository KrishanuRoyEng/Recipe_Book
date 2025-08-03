import { Link } from 'react-router-dom';
import './FabButton.css';

export default function FabButton({ to, tooltip }) {
  return (
    <div className="fab-container">
      <Link to={to} className="fab-button">
        +
      </Link>
      <span className="fab-tooltip">{tooltip}</span>
    </div>
  );
}
