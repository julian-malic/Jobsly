/*
 * Copyright (c) Julian Malic. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useState } from 'react';
import axios from 'axios';
import { app_id, app_key } from '../config';
import ScrollToTop from "react-scroll-to-top";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function JobList() {

    const [query, setQuery] = useState({
        search_terms: "",
        location: "",
        sort_by: "date",
        sort_dir: "up",
        min_salary: 0,
        max_salary: 0,
        max_days_old: 7
    });

    const [jobs, setJobs] = useState(null);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [moreFilters, setMoreFilters] = useState(false);
    
    const search = () => {
        axios.get(`https://api.adzuna.com/v1/api/jobs/au/search/${currentPageNumber}?app_id=${app_id}&app_key=${app_key}&what=${query.search_terms}&where=${query.location}`)
        .then((response) => {
            console.log(response.data);
            setJobs(response.data);
        });
    }

    return (
        <>
            <nav class="navbar navbar-expand shadow bg-primary bg-gradient text-white">
                <div class="row mx-auto">
                    <div class="col my-auto">
                        <h1>Jobsly</h1>
                    </div>
                </div>
                <div class="row mx-auto">
                    <div class="col my-auto">
                        <input type="input" class="rounded form-control" placeholder="Job title..." onChange={(e) => {setQuery({...query, search_terms: e.target.value})}}/>
                    </div>
                    <div class="col my-auto">
                        <input type="input" class="rounded form-control" placeholder="Location..." onChange={(e) => {setQuery({...query, location: e.target.value})}}/>
                    </div>
                    <div class="col my-auto">
                        <button class="btn btn-light" onClick={search}>Search</button>
                    </div>
                </div>
            </nav>
            <div class="container">
                {jobs && 
                <div class="row p-3">
                    {jobs.results.map((job) => {
                        return <div class="rounded border my-2 p-5 shadow">
                                    {(job.contract_time || job.contract_type) && <h4 class="text-capitalize">{job.title} - {job.contract_time.toString().replace("_", " ")} {job.contract_type}</h4>}
                                    {!job.contract_time && <h4>{job.title}</h4>}
                                    {console.log(job.contract_time)}
                                    <p class="text-muted mb-0">{job.company.display_name}</p>
                                    <p class="text-muted">{job.location.display_name}</p>
                                    <p>{job.description}</p>
                                    <button class="btn btn-primary" onClick={() => window.open(job.redirect_url, '_blank')}>View post</button>
                                </div>
                    })}
                    <div class="row text-center mt-4">
                        <div class="col">
                            {currentPageNumber > 1 && 
                                <button class="btn btn-primary mx-2" onClick={() => { setCurrentPageNumber(currentPageNumber-1); search();}}>
                                    <i class="bi bi-arrow-left"/>
                                </button>
                            }
                        </div>
                        <div class="col">
                            <h4>Page {currentPageNumber} / {parseInt(jobs.count / jobs.results.length)}</h4>
                        </div>
                        <div class="col">
                            {currentPageNumber < jobs.count / jobs.results.length && 
                                <button class="btn btn-primary" onClick={() => { setCurrentPageNumber(currentPageNumber+1); search();}}>
                                    <i class="bi bi-arrow-right"/>
                                </button>
                            }
                        </div>
                    </div>
                </div>}
                <ScrollToTop smooth />
            </div>
        </>
    );
}