import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

    

    constructor(
        @InjectModel(Pokemon.name)
        private readonly pokemonModel: Model<Pokemon>,
        private readonly http: AxiosAdapter,
    ) { }

    async executeSeed() {
        await this.pokemonModel.deleteMany({}) //delete * from pokemons

        const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=100')

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
