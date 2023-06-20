import { Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import axios from 'axios'
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {

    private readonly axios: AxiosInstance = axios

    constructor(
        @InjectModel(Pokemon.name)
        private readonly pokemonModel: Model<Pokemon>
    ) { }

    async executeSeed() {
        await this.pokemonModel.deleteMany({}) //delete * from pokemons

        const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=100')

        const pokemonInsert: { name: string, no: number }[] = []

        data.results.forEach(async ({ name, url }) => {
            const segments = url.split('/')
            const no = +segments[segments.length - 2]
            // await this.pokemonModel.create({ name, no })

            pokemonInsert.push({ name, no }) //[{name: 'bulbasor', no: 1}]
        })

        await this.pokemonModel.insertMany(pokemonInsert)
        return 'Seed executed'
    }
}
