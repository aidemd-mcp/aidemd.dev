import observerCopy from "@/app/observer/_data/observerCopy";
import InstallBox from "../shared/InstallBox";
import FactList from "./FactList";

/**
 * The page hero: kicker, headline, subhead, pain line, install box and fact
 * row, in the handoff's `HeroCopy` order, wrapped in the Variant A
 * `<header className="hero">`.
 */
export default function Hero() {
	const { kicker, h1, sub, pain } = observerCopy;

	return (
		<header className="hero">
			<div className="o2-k">{kicker}</div>
			<h1 className="o2-h1">{h1}</h1>
			<p className="o2-sub">{sub}</p>
			<p className="o2-pain">{pain}</p>
			<InstallBox />
			<FactList />
		</header>
	);
}
