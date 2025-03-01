import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

// temporary data this
import tendersData from "@/tempdata/createdtenders"



const DataList = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-primary-100">
            <div className="w-full max-w-7xl bg-primary-200 p-4 rounded-lg">
                <Accordion type="single" collapsible>
                    {
                        tendersData.map((tender) => (
                            <AccordionItem value={tender.contact}>
                                <AccordionTrigger>{tender.title}</AccordionTrigger>
                                <AccordionContent>
                                    <div className="p-4 bg-primary-300 rounded-lg">
                                        <p><strong>Description:</strong> {tender.description}</p>
                                        <p><strong>Category:</strong> {tender.category}</p>
                                        <p><strong>Location:</strong> {tender.location}</p>
                                        <p><strong>Budget:</strong> {tender.budget} {tender.currency}</p>
                                        <Drawer>
                                            <DrawerTrigger className="px-2 py-1 bg-primary-900 rounded-sm">Open</DrawerTrigger>
                                            <DrawerContent>
                                                <DrawerHeader>
                                                    <DrawerTitle>{tender.title}</DrawerTitle>
                                                    <DrawerDescription>{tender.description}</DrawerDescription>
                                                </DrawerHeader>
                                                <p><strong>Date:</strong> {tender.date}</p>
                                                <p><strong>Deadline:</strong> {tender.deadline}</p>
                                                <p><strong>Contact:</strong> {tender.contact}</p>
                                                <p><strong>Phone:</strong> {tender.phone}</p>
                                                <p><strong>Email:</strong> {tender.email}</p>
                                                <DrawerFooter>
                                                    <DrawerClose>
                                                        <Button variant="outline">Close</Button>
                                                    </DrawerClose>
                                                </DrawerFooter>
                                            </DrawerContent>
                                        </Drawer>

                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))
                    }
                </Accordion>

            </div>

        </div >
    )
}

export default DataList
