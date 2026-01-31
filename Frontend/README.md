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

401 = "I dont know who you are" use when token expires
403 = "I know who you are but you can not access this"

httpOnly : true, mean it can only be acces by http JS cannot read cookie Protects from XSS stealing tokens
secure : true, mean it can be acces only by the https not by http
path = "/" mean cooke is sent to every route /cart/orders/profile/auth/refresh/admin

sameSite —
“Who is allowed to send this cookie”
This is about who is making the request
Strict
“Only my own site can send this cookie”
If user clicks a link from:
google.com → yoursite.com
Cookie not sent
Only works if user is already on your site.

Lax (default behavior)
“Allow normal navigation, block shady cross-site requests”
Allows:
Page reload
Normal navigation
Same-site API calls

Blocks:
iframe attacks
hidden form submits
CSRF tricks
Best for most apps

None
“Any site can send this cookie”

# VITE_BACKEND_URL=https://trenzzo.onrender.com/api/v1
# VITE_SOCKET_URL=https://trenzzo.onrender.com
