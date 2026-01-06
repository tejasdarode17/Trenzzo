import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { editAddressAPI } from '@/api/shopper.api';
import AddressForm from '../Address/AddressForm'


const EditAddress = ({ open, setOpen, address }) => {

    const queryClient = useQueryClient()
    const { mutate: editAddress, isPending: loading } = useMutation({
        mutationFn: editAddressAPI,
        onSuccess: () => {
            queryClient.invalidateQueries(["addresses"])
            setOpen(false)
        },
        onError: (error) => {
            console.log(error);
            toast.error(error.response.data.message || "Something went wrong on server")
        }
    })

    function handleEditAddress(deliveryAddress) {
        editAddress({ deliveryAddress, id: address._id })
    }

    return (
        <div>
            <AddressForm onSubmit={handleEditAddress} loading={loading} open={open} setOpen={setOpen} initialData={address}></AddressForm>
        </div >
    )
}

export default EditAddress