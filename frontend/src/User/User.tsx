const User = ({ user }: { user: any }) => {
	return (
		<div className="user">
			<h3>{user.firstName + " " + user.lastName}</h3>
			<p>{user.email}</p>
		</div>
	);
};
export default User;
