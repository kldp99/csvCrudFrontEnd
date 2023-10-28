import React, { useEffect, useMemo, useState } from 'react'
import { Table, Modal, Button, Row, Col, Form } from 'react-bootstrap'
import useForm from '../hooks/useForm'
import { formObj, validate } from '../validate/validateLogin'
import axios from 'axios'

const headers = ["Sr.no", "First Name", "Last Name", "Email", "Age", "Action"]
// const data = [{ name: 'kldp', surName: 'ramdham', age: 23, email: 'kldp@gmail.com' }, { name: 'sahil', surName: 'lande', age: 21, email: 'sahil@gmail.com' }, { name: 'prajaka', surName: 'kawale', age: 24, email: 'prajakta@gmail.com' }, { name: 'aarti', surName: 'shukla', age: 24, email: 'aarti@gmail.com' }]

const Dashboard = () => {
    const [show, setShow] = useState(false);
    const [state, setState] = useState('');
    const [data, setData] = useState([]);
    const [getRow, setGetRow]: any = useState({});

    const getData = async () => {
        const res = await axios.post('http://localhost:4000/get-file-data');
        res.data.data.length && setData(res.data.data);
    }

    const handleClose = () => setShow(false);
    const submit = async () => {
        const res = await axios.post(`http://localhost:4000/${state == "edit" ? 'update-data' : 'add-data'}${state == "edit" ? `/${getRow?.id}` : ''} `, values)
        setShow(false);
        getData();
        setGetRow({});
        setValues({});
        setState('');
    };

    const handleDelete = async (id: Number) => {
        const res = await axios.post(`http://localhost:4000/delete-data/${id}`)
        getData();
    }

    const { handleChange, handleSubmit, values, errors, setValues } = useForm(
        submit,
        validate,
        formObj
    );

    useEffect(() => {
        state == 'add' && setValues((pre: any) => ({ ...pre, id: data?.length + 1 }))
    }, [state])

    useEffect(() => {
        Object.keys(getRow)?.length && setValues(getRow)
    }, [getRow])

    useEffect(() => {
        getData();
    }, [])


    return (
        <div className='w-100'>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>USER DATA</h3>
                <button className='btn btn-sm btn-primary' onClick={() => { setShow(true), setState('add') }} style={{ 'height': '30px' }}>Add User</button>
            </div>
            <Table >
                <thead>
                    <tr>
                        {headers.map((each, idx) => <th key={idx}>{each}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {data.map((each: any, idx) =>
                        <tr key={idx}>
                            <td>{each?.id}</td>
                            <td>{each?.name}</td>
                            <td>{each?.surName}</td>
                            <td>{each?.email}</td>
                            <td>{each?.age}</td>
                            <td><button className='btn btn-sm btn-success' onClick={() => { setShow(true), setGetRow(each), setState('edit') }}>Edit</button><button className='btn btn-sm btn-danger ms-2' onClick={() => handleDelete(each?.id)}>Delete</button></td>

                        </tr>
                    )}
                </tbody>
            </Table>
            <Modal show={show} onHide={handleClose} size="lg" centered >
                <Modal.Header closeButton>
                    <Modal.Title>{state} Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit} className="login-form row">
                        {[{ name: 'name', label: 'Name' }, { name: 'surName', label: 'Surname' }, { name: 'email', label: 'Email' }, { name: 'age', label: 'Age' }].map(({ name, label }, idx) => (
                            <Col md={6}>
                                <Form.Group className="mb-3" key={idx}>
                                    <Form.Label>
                                        {label}
                                    </Form.Label>
                                    <div className="">
                                        <Form.Control
                                            type={idx == 3 ? "number" : "text"}
                                            autoComplete="off"
                                            className="form-control-lg"
                                            autoFocus={true}
                                            onChange={handleChange}
                                            name={name}
                                            value={values[name]}
                                        />
                                    </div>
                                    {errors[name] && <span className="text-danger mt-2">{errors[name]}</span>}
                                </Form.Group>
                            </Col>
                        ))}
                        <div className='d-flex align-items-center justify-content-end'>
                            <button
                                disabled={false}
                                type="submit"
                                className="btn btn-primary btn-sm me-3 py-1 px-2"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={false}
                                type="submit"
                                className="btn btn-success btn-sm py-1 px-2"
                            >
                                {state == "edit" ? "Update" : "Save"}
                            </button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

        </div>
    )
}

export default Dashboard
