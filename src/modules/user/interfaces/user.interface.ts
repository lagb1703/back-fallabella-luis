export interface UserCountInterface{
    userId: string;
    email: string;
    password: string;
}

export interface UserInterface extends UserCountInterface{
    names: string;
    lastNames: string;
    identification: string;
    cmrPoints: number;
    phone: number;
    isSeller: boolean;
    documentTypeId: number;
    documentType: string;
}