import { PropagateLoader } from "react-spinners";

const LoadingSpinner = () => {
	return (
		<div className="flex flex-col justify-center items-center p-30">
			<PropagateLoader color="#4135e6" />
		</div>
	);
};

export default LoadingSpinner;
