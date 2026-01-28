import { useMutation, useQueryClient } from '@tanstack/react-query';
import AddressForm from './AddressForm'
import { toast } from 'sonner';
import { addAddressAPI } from '@/api/shopper.api';


const AddAddress = ({ open, setOpen }) => {

    const queryClient = useQueryClient()
    
    const { mutate: addAddress, isPending: loading } = useMutation({
        mutationFn: addAddressAPI,
        onSuccess: () => {
            queryClient.invalidateQueries(["addresses"])
            setOpen(false)
        },
        onError: (error) => {
            console.log(error);
            toast.error(error.response.data.message || "Something went wrong on server")
        }
    })


    function handleAddAddress(deliveryAddress) {
        addAddress(deliveryAddress)
    }


    return (
        <div>
            <AddressForm onSubmit={handleAddAddress} loading={loading} open={open} setOpen={setOpen}></AddressForm>
        </div>
    )
}

export default AddAddress