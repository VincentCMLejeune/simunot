import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <>
            <div>Xoucou</div>
            <Link to="/succession">
                <button>Aller à Succession</button>
            </Link>
        </>
    );
}