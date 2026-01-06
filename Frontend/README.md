const handleOpenMaps = () => {
const address = `${order.address.address}, ${order.address.locality}, ${order.address.city}, ${order.address.pinCode}`;
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
window.open(mapsUrl, '\_blank');
};

window.open(`tel:${order.address.phoneNumber}`, '\_self');

// uske bad AI
//CANCEL order ki button banegi jab order shipped nahi hua hoga tab visible hogi
//one star wale review product admin dekhega

// io.on(...) → server listens for connections
// socket.on(...) → one specific client listens for events
// io.emit(...) → server talks to everyone
// socket.emit(...) → server talks to one client
// io.to(room).emit(...) → server talks to a group

//race condition

Built a full-stack app using PostgreSQL with relational modeling and transactions, consumed via a TypeScript-based React frontend using TanStack Query, and containerized the backend with Docker.

“I used TanStack Query for server-state management, handling caching, mutations, and cache invalidation in a production-like eCommerce app.”

const mutation = useMutation(...)
{
mutate: function mutateFn(variables) { ... },
mutateAsync: function mutateAsyncFn(variables) { ... },
isLoading: false,
isError: false,
isSuccess: false,
error: null,
}
