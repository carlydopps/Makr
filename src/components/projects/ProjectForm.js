// User can click the logo and route to the home page
// User can view the logged in nav bar
// User can complete a form for project information
// User can click a button to submit a project and trigger a submitted message

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getCurrentUser, getSelectedPro, postProject } from "../ApiManager"
import "./ProjectForm.css"
import { Image } from 'cloudinary-react'
import { Footer } from "../footer/Footer"

export const ProjectForm = () => {

    const {proId} = useParams()
    const [pro, setPro] = useState([])
    const [user, setUser] = useState([])
    const [project, updateProject] = useState({
        title: "",
        description: "",
        date: "",
        time: "",
        image: ""
    })

    const navigate = useNavigate()

    const localUser = localStorage.getItem("current_user")
    const currentUser = JSON.parse(localUser)

    useEffect(
        () => {
            getCurrentUser(currentUser.id)
                .then(data => {
                    const singleUser = data[0]
                    setUser(singleUser)})
        },
        []
    )

    useEffect(
        () => {
            getSelectedPro(proId)
                .then(data => {
                    const selectedPro = data[0]
                    setPro(selectedPro)
                })
        }, 
        [proId]
    )

    const handleSubmit = (event) => {
        event.preventDefault()

        const newProject = {
            userId: user.id,
            proId: pro.id,
            title: project.title,
            description: project.description,
            date: project.date,
            time: new Date(project.date).toLocaleTimeString('en-us'),
            image: project.image
        }

        postProject(newProject)
            .then(() => navigate(`/projects`))
    }

    const showWidget = (event) => {
        
        event.preventDefault()

        let widget = window.cloudinary.createUploadWidget(
        {
            cloudName: "dupram4w7",
            uploadPreset: "huvsusnz"
        },
        (error, result) => {
            if (!error && result && result.event === "success") {
                const copy = {...project}
                copy.image = result.info.url
                updateProject(copy)
            }})
            widget.open()
    }

    return <>
    <div className="page-form">
    <main className="container-projectForm">
        <section className="img-container-form">
            <img src="https://res.cloudinary.com/dupram4w7/image/upload/v1663809673/How_we_DIYed_our_A-Frame_playhouse_in_our_backyard___Petit_Architect_g7rfvv.jpg" className="img-form"/>
        </section>
        <form className="form-projectRequest">
            <h2 className="projectForm__title">New Project Request</h2>
            <p className="form-user">User: {user.name}</p>
            <p className="form-pro">Professional: {pro?.user?.name}</p>
            <fieldset>
                <label htmlFor="title"></label>
                <input
                    required autoFocus
                    type="text"
                    className="form-control"
                    placeholder="Title of the project"
                    value={project.title}
                    onChange={
                        (event) => {
                            const copy = {...project}
                            copy.title = event.target.value
                            updateProject(copy)
                        }
                    }
                />
            </fieldset>
            <fieldset>
                <label htmlFor="description"></label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Detailed description of the problem"
                    value={project.description}
                    onChange={
                        (event) => {
                            const copy = {...project}
                            copy.description = event.target.value
                            updateProject(copy)
                        }
                    }
                />
            </fieldset>
            <fieldset>
                <label htmlFor="date">Preferred Date of Service: </label>
                <input
                    type="datetime-local"
                    className="form-control"
                    placeholder="Preferred date of service"
                    value={project.date}
                    onChange={
                        (event) => {
                            const copy = {...project}
                            copy.date = event.target.value
                            updateProject(copy)
                        }
                    }
                />
            </fieldset>
            <section>
                {
                    project.image !== ""
                    ? <img src={project.image} alt="" className="image-projectForm"/>
                    : ""
                }
                
                <button onClick={(event) => showWidget(event)}
                    className="cloudinary-button">
                    Add photo
                </button>
            </section>
            <button
                onClick={(event) => handleSubmit(event)}
                className="btn__submit"
                >Submit Request</button>
        </form>
        
        </main>
        </div>
        <Footer/>
    </>
    
}