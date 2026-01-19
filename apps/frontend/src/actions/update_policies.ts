'use server'

import { caller } from "~/trpc/server"

export async function updatePermission(){
    const modules = await caller.module.all();
    //
}