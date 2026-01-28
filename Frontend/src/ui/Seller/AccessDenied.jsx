import { Button } from '@/components/ui/button'
import { ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AccessDenied = ({ status }) => {
    const getMessage = () => {
        switch (status) {
            case "pending":
                return "We’re reviewing your application. You’ll be notified once approved."
            case "suspended":
                return "Your account is temporarily suspended. Please contact support for clarification."
            case "banned":
                return "Your account has been permanently banned. If you believe this is a mistake, reach out to our team."
            case "rejected":
                return "Your application was rejected. You may re-apply with updated details."
            default:
                return "You are not authorized to access this section."
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[80vh] p-6">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="flex flex-col items-center text-center space-y-2">
                    <ShieldAlert className="h-12 w-12 text-red-500" />
                    <CardTitle className="text-2xl font-bold text-gray-800">
                        Access Restricted
                    </CardTitle>
                </CardHeader>

                <CardContent className="text-center space-y-4">
                    <p className="text-gray-600">
                        Your account status:{" "}
                        <span className="font-semibold capitalize">{status}</span>
                    </p>
                    <p className="text-sm text-gray-500">{getMessage()}</p>

                    <Button className="mt-4 w-full">Contact Support</Button>
                </CardContent>
            </Card>
        </div>
    )
}


export default AccessDenied