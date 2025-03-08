export interface UserAcountInterface{
    userId: string;
    email: string;
    password: string;
}

export interface UserInterface extends UserAcountInterface{
    names: string;
    lastNames: string;
    identification: string;
    cmrPoints: number;
    phone: number;
    isSeller: boolean;
    documentTypeId: number;
    documentType: string;
}